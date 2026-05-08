import { useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import api from "../api/axiosInstance.js";
import {
  pageBackground,
  formCard,
  formTitle,
  formGroup,
  labelClass,
  textareaClass,
  submitBtn,
  errorClass,
  loadingClass,
} from "../styles/common.js";

function CreatePost() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // POST /post-api/create — multipart/form-data { image, caption }
  const onSubmit = async (formData) => {
    if (!formData.image?.[0]) {
      toast.error("Please select an image");
      return;
    }

    const data = new FormData();
    data.append("image", formData.image[0]);
    if (formData.caption) data.append("caption", formData.caption);

    setLoading(true);
    try {
      const res = await api.post("/post-api/create", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status === 201) {
        toast.success("Post created!");
        navigate("/profile");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className={loadingClass}>Creating post...</p>;

  return (
    <div className={`${pageBackground} flex items-center justify-center py-16 px-4`}>
      <div className={formCard}>
        <h2 className={formTitle}>New Post</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Image upload */}
          <div className={formGroup}>
            <label className={labelClass}>Photo</label>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="w-full text-sm text-[#6e6e73] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#0066cc] file:text-white hover:file:bg-[#004499] cursor-pointer"
              {...register("image", { required: "Image is required" })}
              onChange={(e) => {
                register("image").onChange(e);
                handleImageChange(e);
              }}
            />
            {errors.image && <p className={errorClass}>{errors.image.message}</p>}
          </div>

          {/* Preview */}
          {preview && (
            <div className="mb-4 rounded-2xl overflow-hidden">
              <img src={preview} alt="preview" className="w-full aspect-square object-cover" />
            </div>
          )}

          {/* Caption */}
          <div className={formGroup}>
            <label className={labelClass}>Caption (optional)</label>
            <textarea
              className={textareaClass}
              rows={3}
              placeholder="Write a caption…"
              {...register("caption")}
            />
          </div>

          <button type="submit" className={submitBtn}>
            Share Post
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreatePost;
