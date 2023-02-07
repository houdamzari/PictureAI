import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { preview } from "../assets";
import { Form, Loader } from "../components";

const GenerateImg = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", prompt: "", photo: "" });
  const [loading, setLoading] = useState(false);
  const [generatingImg, setGeneratingImg] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const generateImage = async () => {
    if (!form.prompt) {
      return alert("Please provide a proper value");
    }

    setGeneratingImg(true);

    try {
      const response = await fetch("http://localhost:8080/api/v1/dalle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: form.prompt,
        }),
      });

      const data = await response.json();
      setForm({ ...form, photo: `data:image/jpeg;base64,${data.photo}` });
    } catch (err) {
      alert(err);
    } finally {
      setGeneratingImg(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.prompt || !form.photo) {
      return alert("Please generate an image with proper details");
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/v1/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...form }),
      });

      await response.json();
      alert("Success");
      navigate("/");
    } catch (err) {
      alert(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" w-full flex justify-between overflow-hidden">
      <section className=" p-16">
        <div>
          <h1 className="font-extrabold text-#222328 text-32px">
            Welcome to PictureAI
          </h1>
          <p className="mt-2 text-#666e75 text-14px  w-96">
            PictureAI is an innovative AI-powered platform that generates
            realistic images based on a given text description. With the help of
            advanced algorithms and deep learning models, PictureAI can quickly
            translate written ideas into visually stunning graphics. Whether you
            need an image for your blog, website, or social media, PictureAI
            makes it easy to bring your imagination to life. Get the picture you
            need in seconds with PictureAI.
          </p>
        </div>

        <form className="mt-16 max-w-3xl" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-5">
            <Form
              label="Prompt"
              type="text"
              name="prompt"
              placeholder="An Impressionist oil painting of sunflowers in a purple vase…"
              value={form.prompt}
              handleChange={handleChange}
            />
          </div>

          <div className="mt-5 flex gap-5">
            <button
              type="button"
              onClick={generateImage}
              className=" text-white bg-pink-600 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            >
              {generatingImg ? "Generating..." : "Generate"}
            </button>
          </div>
        </form>
      </section>
      <section className="p-0">
        <div
          className="relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 flex justify-center items-center h-full "
          style={{ width: 600, height: 550 }}
        >
          {form.photo ? (
            <img
              src={form.photo}
              alt={form.prompt}
              className="w-full h-full object-contain"
            />
          ) : (
            <img
              src={preview}
              alt="preview"
              className="w-9/12 h-9/12 object-contain opacity-40"
            />
          )}

          {generatingImg && (
            <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
              <Loader />
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default GenerateImg;
