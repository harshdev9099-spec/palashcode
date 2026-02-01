import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import adminService from '../../services/adminService';
import { toast } from 'react-toastify';

const QUESTION_TYPES = [
  { value: 'mcq', label: 'Multiple Choice' },
  { value: 'fill_blank', label: 'Form Completion' },
  { value: 'sentence_completion', label: 'Sentence Completion' },
  { value: 'matching', label: 'Matching' },
  { value: 'table_completion', label: 'Table Completion' },
  { value: 'map_labeling', label: 'Map Labeling' },
];

const TEXT_BASED_TYPES = ['fill_blank', 'sentence_completion', 'table_completion'];

const PART_DEFAULTS = [
  { title: 'Part 1 - Form Completion', instructions: 'Complete the form below. Write NO MORE THAN THREE WORDS AND/OR A NUMBER for each answer.', defaultType: 'fill_blank' },
  { title: 'Part 2 - Map / Diagram Labeling', instructions: 'Label the map/diagram below. Choose the correct letter, A-G.', defaultType: 'map_labeling' },
  { title: 'Part 3 - Multiple Choice', instructions: 'Choose the correct letter, A, B or C.', defaultType: 'mcq' },
  { title: 'Part 4 - Academic Lecture Notes', instructions: 'Complete the notes below. Write NO MORE THAN TWO WORDS for each answer.', defaultType: 'sentence_completion' },
];

const emptyQuestion = (type = 'mcq') => ({
  question_type: type,
  question_text: '',
  option_a: '', option_b: '', option_c: '', option_d: '',
  correct_answer: (type === 'mcq' || type === 'matching') ? 'a' : '',
  word_limit: TEXT_BASED_TYPES.includes(type) ? 3 : null,
});

const createInitialParts = () =>
  PART_DEFAULTS.map((def) => ({
    title: def.title,
    instructions: def.instructions,
    audio: null,
    image: null,
    questions: Array.from({ length: 10 }, () => emptyQuestion(def.defaultType)),
  }));

const ListeningTestCreatePage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [parts, setParts] = useState(createInitialParts);
  const [activePart, setActivePart] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const updatePart = (pi, field, value) => {
    const u = [...parts];
    u[pi] = { ...u[pi], [field]: value };
    setParts(u);
  };

  const updateQuestion = (pi, qi, field, value) => {
    const u = [...parts];
    const qs = [...u[pi].questions];
    qs[qi] = { ...qs[qi], [field]: value };
    if (field === 'question_type') {
      const isText = TEXT_BASED_TYPES.includes(value);
      const isChoice = value === 'mcq' || value === 'matching';
      qs[qi].correct_answer = isChoice ? 'a' : '';
      qs[qi].word_limit = isText ? 3 : null;
      if (isText || value === 'map_labeling') {
        qs[qi].option_a = ''; qs[qi].option_b = ''; qs[qi].option_c = ''; qs[qi].option_d = '';
      }
    }
    u[pi] = { ...u[pi], questions: qs };
    setParts(u);
  };

  const addQuestion = (pi, type) => {
    const u = [...parts];
    u[pi] = { ...u[pi], questions: [...u[pi].questions, emptyQuestion(type)] };
    setParts(u);
  };

  const removeQuestion = (pi, qi) => {
    const u = [...parts];
    if (u[pi].questions.length <= 1) return;
    u[pi] = { ...u[pi], questions: u[pi].questions.filter((_, i) => i !== qi) };
    setParts(u);
  };

  const validateForm = () => {
    if (!title) { toast.error('Test title is required'); return false; }
    for (let pi = 0; pi < 4; pi++) {
      const p = parts[pi];
      if (!p.title || !p.instructions) { toast.error(`Part ${pi + 1}: Title and instructions required`); return false; }
      if (!p.audio) { toast.error(`Part ${pi + 1}: Audio file required`); return false; }
      for (let qi = 0; qi < p.questions.length; qi++) {
        const q = p.questions[qi];
        if (!q.question_text) { toast.error(`Part ${pi + 1}, Q${qi + 1}: Question text required`); return false; }
        if (!q.correct_answer) { toast.error(`Part ${pi + 1}, Q${qi + 1}: Correct answer required`); return false; }
        if ((q.question_type === 'mcq' || q.question_type === 'matching') && (!q.option_a || !q.option_b || !q.option_c)) {
          toast.error(`Part ${pi + 1}, Q${qi + 1}: Options A, B, C required`); return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('is_active', isActive ? '1' : '0');
      formData.append('parts', JSON.stringify(parts.map((p) => ({
        title: p.title, instructions: p.instructions, questions: p.questions,
      }))));
      parts.forEach((p, i) => {
        if (p.audio) formData.append(`audio_part_${i + 1}`, p.audio);
        if (p.image) formData.append(`image_part_${i + 1}`, p.image);
      });
      await adminService.createListeningTest(formData);
      toast.success('Listening test created successfully');
      navigate('/admin/listening-tests');
    } catch (error) {
      toast.error(error.message || 'Failed to create test');
    } finally {
      setSubmitting(false);
    }
  };

  const cp = parts[activePart];
  const totalQ = parts.reduce((s, p) => s + p.questions.length, 0);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Create IELTS Listening Test</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Test Details */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">Test Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., IELTS Listening Practice Test 1" />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)}
                  className="h-4 w-4 text-primary-600 border-gray-300 rounded" />
                <span className="text-sm text-gray-700">Active (visible to students)</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" placeholder="Brief description..." />
          </div>
          <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-700">
            Total: <strong>{totalQ}</strong> questions across 4 parts (IELTS standard: 40)
          </div>
        </div>

        {/* Part Tabs */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="flex border-b">
            {parts.map((p, i) => (
              <button key={i} type="button" onClick={() => setActivePart(i)}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-all ${
                  activePart === i ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-50'
                }`}>
                Part {i + 1}
                <span className={`block text-xs ${activePart === i ? 'text-blue-200' : 'text-gray-400'}`}>{p.questions.length}Q</span>
              </button>
            ))}
          </div>

          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Part Title *</label>
                <input type="text" value={cp.title} onChange={(e) => updatePart(activePart, 'title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Audio File *</label>
                <input type="file" accept=".mp3,.wav,.ogg,.m4a"
                  onChange={(e) => updatePart(activePart, 'audio', e.target.files[0])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                {cp.audio && <p className="text-xs text-green-600 mt-1">{cp.audio.name}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instructions *</label>
              <textarea value={cp.instructions} onChange={(e) => updatePart(activePart, 'instructions', e.target.value)} rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500" />
            </div>
            {activePart === 1 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Map / Diagram Image</label>
                <input type="file" accept="image/*" onChange={(e) => updatePart(activePart, 'image', e.target.files[0])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                {cp.image && <p className="text-xs text-green-600 mt-1">{cp.image.name}</p>}
              </div>
            )}

            {/* Questions */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Questions ({cp.questions.length})</h3>
                <div className="flex gap-1 flex-wrap">
                  {QUESTION_TYPES.slice(0, 4).map((t) => (
                    <button key={t.value} type="button" onClick={() => addQuestion(activePart, t.value)}
                      className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium hover:bg-gray-200">+ {t.label}</button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {cp.questions.map((q, qi) => {
                  const type = q.question_type;
                  const isTextBased = TEXT_BASED_TYPES.includes(type);
                  const isChoice = type === 'mcq' || type === 'matching';
                  const isMap = type === 'map_labeling';

                  return (
                    <div key={qi} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-700">Q{qi + 1}</h4>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                            {QUESTION_TYPES.find(t => t.value === type)?.label}
                          </span>
                        </div>
                        {cp.questions.length > 1 && (
                          <button type="button" onClick={() => removeQuestion(activePart, qi)} className="text-red-500 hover:text-red-700 text-xs">Remove</button>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {QUESTION_TYPES.map((t) => (
                            <button key={t.value} type="button"
                              onClick={() => updateQuestion(activePart, qi, 'question_type', t.value)}
                              className={`px-2 py-1 rounded-full text-[10px] font-medium ${
                                type === t.value ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}>{t.label}</button>
                          ))}
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Question Text</label>
                          <input type="text" value={q.question_text}
                            onChange={(e) => updateQuestion(activePart, qi, 'question_text', e.target.value)}
                            placeholder={isTextBased ? 'e.g., The meeting is at ___' : isMap ? 'e.g., Where is the reception?' : 'Question text...'}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500" />
                        </div>

                        {isChoice && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {['a', 'b', 'c', 'd'].map((opt) => (
                              <div key={opt} className="flex items-center space-x-2">
                                <input type="radio" name={`c_${activePart}_${qi}`} checked={q.correct_answer === opt}
                                  onChange={() => updateQuestion(activePart, qi, 'correct_answer', opt)} className="h-4 w-4 text-primary-600" />
                                <span className="text-sm font-medium text-gray-500 uppercase w-4">{opt}.</span>
                                <input type="text" value={q[`option_${opt}`]}
                                  onChange={(e) => updateQuestion(activePart, qi, `option_${opt}`, e.target.value)}
                                  placeholder={`Option ${opt.toUpperCase()}`}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500" />
                              </div>
                            ))}
                          </div>
                        )}

                        {isMap && (
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Correct Label</label>
                            <select value={q.correct_answer}
                              onChange={(e) => updateQuestion(activePart, qi, 'correct_answer', e.target.value)}
                              className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-sm">
                              <option value="">Select</option>
                              {['A','B','C','D','E','F','G'].map((l) => <option key={l} value={l}>{l}</option>)}
                            </select>
                          </div>
                        )}

                        {isTextBased && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">Correct Answer</label>
                              <input type="text" value={q.correct_answer}
                                onChange={(e) => updateQuestion(activePart, qi, 'correct_answer', e.target.value)}
                                placeholder="e.g., Monday afternoon"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                              <p className="text-[10px] text-gray-400 mt-1">Use | for alternatives</p>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">Word Limit</label>
                              <select value={q.word_limit || 3}
                                onChange={(e) => updateQuestion(activePart, qi, 'word_limit', parseInt(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                                <option value={1}>ONE WORD ONLY</option>
                                <option value={2}>NO MORE THAN TWO WORDS</option>
                                <option value={3}>THREE WORDS AND/OR A NUMBER</option>
                              </select>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <button type="submit" disabled={submitting}
            className="bg-gradient-to-r from-secondary-500 to-accent-500 text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50">
            {submitting ? 'Creating...' : 'Create Test'}
          </button>
          <button type="button" onClick={() => navigate('/admin/listening-tests')}
            className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default ListeningTestCreatePage;
