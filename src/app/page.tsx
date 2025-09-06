"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const questions = [
  {
    id: "q1",
    question: "Which JavaScript framework is used for building UI components?",
    options: ["React", "Spring Boot", "Django", "Laravel"],
  },
  {
    id: "q2",
    question: "Which database is commonly used with the MERN stack?",
    options: ["PostgreSQL", "MongoDB", "MySQL", "SQLite"],
  },
  {
    id: "q3",
    question: "Which protocol is primarily used for secure communication?",
    options: ["HTTP", "FTP", "HTTPS", "SMTP"],
  },
  {
    id: "q4",
    question: "Which Node.js package is commonly used for REST APIs?",
    options: ["Express.js", "Flask", "Rails", "ASP.NET"],
  },
  {
    id: "q5",
    question: "Which cloud platform is known for serverless functions?",
    options: ["AWS Lambda", "Apache Tomcat", "Nginx", "Heroku"],
  },
];

export default function QuizPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const current = questions[step === 0 ? 0 : step - 1];

  const handleOptionSelect = (opt: string) => {
    setAnswers({ ...answers, [current.id]: opt });
  };

  const handleNext = async () => {
    if (step === 0 && (!name || !email)) {
      alert("Please enter your name and email");
      return;
    }
    if (!answers[current.id] && step > 0) {
      alert("Please select an option");
      return;
    }

    if (step < questions.length) {
      setStep(step + 1);
    } else {
      // Final submit
      const answersArray = Object.values(answers);

      const payload = { name, email, answers: answersArray };

      console.log(answers);

      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        alert("Something went wrong!");
        return;
      }

      const data = await res.json();

      await fetch("/api/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      router.push(`/result/${data.id}`);
    }
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-r from-white via-orange-300 to-white px-4 text-neutral-950">
      <div className="mb-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded">
        <p className="text-sm text-yellow-800">
          ⚠️ Note: ZeptoMail integration has been fully implemented in this project.
          However, since a custom domain is required to configure a live ZeptoMail account,
          the API key is not added here.
        </p>
      </div>

      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl">
        {step === 0 ? (
          <>
            <h1 className="mb-6 text-2xl font-bold text-gray-800">
              Welcome to the Quiz
            </h1>
            <input
              type="text"
              placeholder="Your Name"
              className="mb-4 w-full rounded-lg border p-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Your Email"
              className="mb-6 w-full rounded-lg border p-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </>
        ) : (
          <>
            <h1 className="mb-6 text-2xl font-bold text-gray-800">
              Question {step} of {questions.length}
            </h1>
            <p className="mb-6 text-lg text-gray-700">{current?.question}</p>
            <div className="space-y-4">
              {current.options.map((opt) => (
                <label
                  key={opt}
                  className={`flex cursor-pointer items-center rounded-lg border p-3 transition ${answers[current.id] === opt
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-300"
                    }`}
                >
                  <input
                    type="radio"
                    name={current.id}
                    value={opt}
                    checked={answers[current.id] === opt}
                    onChange={() => handleOptionSelect(opt)}
                    className="mr-3"
                  />
                  <span className="text-gray-800">{opt}</span>
                </label>
              ))}
            </div>
          </>
        )}

        <div className="mt-8 flex justify-between">
          <button
            onClick={handlePrev}
            disabled={step === 0}
            className="rounded-xl bg-gray-400 px-6 py-2 text-white shadow-md hover:bg-gray-500 disabled:opacity-50 cursor-pointer"
          >
            ← Previous
          </button>
          <button
            onClick={handleNext}
            className="rounded-xl bg-orange-600 px-6 py-2 text-white shadow-md hover:bg-orange-700 cursor-pointer"
          >
            {step === questions.length ? "Submit" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
}
