import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { useResume } from '../../hooks/useResume';

export default function ResumeUpload({ onUploaded }) {
  const { loading, submitFileResume, submitTextResume } = useResume();
  const [activeTab, setActiveTab] = useState('file');
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');

  const onDrop = (accepted) => {
    if (!accepted?.length) return;
    setFile(accepted[0]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 5 * 1024 * 1024,
    multiple: false,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    onDropRejected: () => toast.error('Only PDF/DOCX/TXT up to 5MB are allowed'),
  });

  const handleSubmit = async () => {
    if (activeTab === 'file') {
      if (!file) return toast.error('Please select a resume file');
      const result = await submitFileResume(file);
      if (result && onUploaded) onUploaded(result);
    } else {
      if (text.trim().length < 50) return toast.error('Please paste at least 50 characters');
      const result = await submitTextResume(text);
      if (result && onUploaded) onUploaded(result);
    }
  };

  return (
    <section className="card space-y-4">
      <div className="flex gap-2 rounded-lg bg-surface p-1">
        <button type="button" onClick={() => setActiveTab('file')} className={`flex-1 rounded-md px-3 py-2 text-sm ${activeTab === 'file' ? 'bg-primary text-white' : 'text-gray-300'}`}>
          Upload File
        </button>
        <button type="button" onClick={() => setActiveTab('text')} className={`flex-1 rounded-md px-3 py-2 text-sm ${activeTab === 'text' ? 'bg-primary text-white' : 'text-gray-300'}`}>
          Paste Text
        </button>
      </div>

      {activeTab === 'file' ? (
        <div {...getRootProps()} className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-700'}`}>
          <input {...getInputProps()} />
          <p className="text-gray-300">Drag and drop your resume here or click to browse</p>
          <p className="mt-2 text-xs text-gray-500">PDF, DOCX or TXT (max 5MB)</p>
          {file && <p className="mt-3 text-sm text-primary">Selected: {file.name}</p>}
        </div>
      ) : (
        <textarea
          className="input min-h-56"
          placeholder="Paste your resume text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      )}

      <button type="button" onClick={handleSubmit} disabled={loading} className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50">
        {loading ? 'Processing...' : 'Submit Resume'}
      </button>
    </section>
  );
}
