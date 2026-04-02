import { useState } from "react";
import toast from "react-hot-toast";
import { getMyResume, uploadResume, pasteResume } from "../services/api";

export const useResume = () => {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchResume = async () => {
    try {
      setLoading(true);
      const res = await getMyResume();
      setResume(res.data.resume);
      return res.data.resume;
    } catch {
      setResume(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const submitFileResume = async (file) => {
    const formData = new FormData();
    formData.append("resume", file);
    setLoading(true);
    try {
      const res = await uploadResume(formData);
      setResume(res.data.resume);
      toast.success("Resume uploaded successfully!");
      return res.data.resume;
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const submitTextResume = async (text) => {
    setLoading(true);
    try {
      const res = await pasteResume(text);
      setResume(res.data.resume);
      toast.success("Resume saved!");
      return res.data.resume;
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { resume, loading, fetchResume, submitFileResume, submitTextResume };
};
