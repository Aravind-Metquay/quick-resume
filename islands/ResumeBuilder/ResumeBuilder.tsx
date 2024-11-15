interface ResumeData {
    aboutMe: string;
    projects: string;
    experience: string;
    skills: string;
    education: string;
  }
  
interface InputFieldProps {
    label: string;
    value: { value: string };
    onChange: { value: string };
    placeholder: string;
    error?: string;
  }
  
  import { useSignal } from "@preact/signals";
  import { generateResumePDF } from "./resumeRenderer.ts";
  import type { JSX } from "preact";
  
  export default function ResumeBuilder(): JSX.Element {
    const aboutMe = useSignal<string>("");
    const projects = useSignal<string>("");
    const experience = useSignal<string>("");
    const skills = useSignal<string>("");
    const education = useSignal<string>("");
    const isGenerating = useSignal<boolean>(false);
    const errors = useSignal<Partial<Record<keyof ResumeData, string>>>({});
  
    const validateForm = (): boolean => {
      const newErrors: Partial<Record<keyof ResumeData, string>> = {};
      let isValid = true;
  
      if (aboutMe.value.trim().length < 10) {
        newErrors.aboutMe = "About Me must be at least 10 characters long";
        isValid = false;
      }
  
      if (skills.value.trim().length === 0) {
        newErrors.skills = "Skills are required";
        isValid = false;
      }
  
      if (education.value.trim().length === 0) {
        newErrors.education = "Education is required";
        isValid = false;
      }
  
      errors.value = newErrors;
      return isValid;
    };
  
    const handleSubmit = (): void => {
      if (!validateForm()) {
        return;
      }
  
      isGenerating.value = true;
      try {
        generateResumePDF(
          aboutMe.value,
          education.value,
          skills.value,
          experience.value,
          projects.value
        );
      } catch (error) {
        console.error("Error generating PDF:", error);
        // Handle error appropriately
      } finally {
        isGenerating.value = false;
      }
    };
  
    const InputField = ({ 
      label, 
      value, 
      onChange, 
      placeholder, 
      error 
    }: InputFieldProps): JSX.Element => (
      <div className="w-full space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {error && <span className="text-red-500 text-xs ml-2">*</span>}
        </label>
        <textarea
          value={value.value}
          onChange={(e: JSX.TargetedEvent<HTMLTextAreaElement, Event>) => 
            onChange.value = e.currentTarget.value
          }
          placeholder={placeholder}
          aria-invalid={!!error}
          aria-describedby={error ? `${label}-error` : undefined}
          className={`w-full min-h-[120px] p-3 border rounded-lg shadow-sm transition duration-200 resize-y
            ${error 
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }`}
        />
        {error && (
          <p 
            id={`${label}-error`} 
            className="text-red-500 text-xs mt-1"
          >
            {error}
          </p>
        )}
      </div>
    );
  
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Resume Builder
            </h1>
            <p className="text-gray-600">
              Create your professional resume in minutes
            </p>
          </div>
  
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
            <div className="grid gap-6">
              <InputField
                label="About Me"
                value={aboutMe}
                onChange={aboutMe}
                placeholder="Write a brief introduction about yourself..."
                error={errors.value.aboutMe}
              />
  
              <InputField
                label="Experience"
                value={experience}
                onChange={experience}
                placeholder="List your work experience..."
                error={errors.value.experience}
              />
  
              <InputField
                label="Projects"
                value={projects}
                onChange={projects}
                placeholder="Describe your notable projects..."
                error={errors.value.projects}
              />
  
              <InputField
                label="Skills"
                value={skills}
                onChange={skills}
                placeholder="List your skills (comma separated)..."
                error={errors.value.skills}
              />
  
              <InputField
                label="Education"
                value={education}
                onChange={education}
                placeholder="Enter your educational background..."
                error={errors.value.education}
              />
            </div>
  
            <div className="flex items-center justify-end mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={handleSubmit}
                disabled={isGenerating.value}
                className="inline-flex items-center px-6 py-3 border border-transparent 
                  text-base font-medium rounded-md shadow-sm text-white bg-blue-600 
                  hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                  focus:ring-blue-500 transition duration-200 disabled:opacity-50 
                  disabled:cursor-not-allowed gap-2"
                type="button"
              >
                Save
                {isGenerating.value ? "Generating..." : "Generate PDF"}
              </button>
            </div>
          </div>
  
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>
              All your information is processed locally. Your data is never stored or shared.
            </p>
          </div>
        </div>
      </div>
    );
  }