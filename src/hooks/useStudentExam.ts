import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Question } from '../types/exam';
import { useModalStore } from '../stores/use-modal-store';
import { startExam, submitExam } from '../api/exams';
import toast from 'react-hot-toast';

export function useStudentExam() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { activeModal, openModal, closeModal } = useModalStore();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [attemptId, setAttemptId] = useState("");
  const [examInfo, setExamInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(3600);

  const startExamSession = async () => {
    setIsLoading(true);
    try {
      const res = await startExam({ examId: id! });
      if (res.data) {
        setAttemptId(res.data.attemptId);
        setExamInfo(res.data.exam);
        
        const startTimeMs = res.data.startTime ? new Date(res.data.startTime).getTime() : Date.now();
        const durationMinutes = res.data.exam.durationMinutes || 60;
        const durationMs = durationMinutes * 60 * 1000;
        const closingAtMs = (res.data.exam.closingAt || 0) * 1000;
        
        const attemptEndTime = startTimeMs + durationMs;
        const endTimestamp = (closingAtMs > 0 && closingAtMs > startTimeMs) ? Math.min(attemptEndTime, closingAtMs) : attemptEndTime;
        
        const remaining = Math.max(0, Math.floor((endTimestamp - Date.now()) / 1000));
        setTimeLeft(remaining);
        
        // Map backend questions to frontend format
        const mapped = res.data.questions.map((q: any) => ({
          id: q._id,
          type: q.typeQue === "MCQ" ? "Multiple Choice" : "True/False",
          text: q.title,
          points: 1,
          options: q.typeQue === "MCQ" ? q.options.map((opt: string) => ({ id: opt, text: opt })) : undefined
        }));
        setQuestions(mapped);
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to load exam";
      toast.error(errorMsg);
      if (err.response?.status === 409) {
        navigate("/student/dashboard");
      } else {
        navigate("/");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      startExamSession();
    }
  }, [id]);

  // Trap browser Back button and tab refresh/close while exam is in progress
  useEffect(() => {
    if (isLoading || isSubmitting) return;

    window.history.pushState(null, "", window.location.href);

    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      window.history.pushState(null, "", window.location.href);
      openModal("confirmExitExam");
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isLoading, isSubmitting, openModal]);

  const currentQuestion = questions[currentIndex];

  const handleAnswerChange = (ans: any) => {
    if (!currentQuestion) return;
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: ans }));
  };

  const handleToggleFlag = () => {
    if (!currentQuestion) return;
    setFlagged(prev => {
      const newFlagged = new Set(prev);
      if (newFlagged.has(currentQuestion.id)) {
        newFlagged.delete(currentQuestion.id);
      } else {
        newFlagged.add(currentQuestion.id);
      }
      return newFlagged;
    });
  };

  const handleSubmitClick = () => {
    const answeredCount = Object.keys(answers).length;
    if (answeredCount < questions.length) {
      openModal('confirmSubmitExam');
    } else {
      executeSubmit();
    }
  };

  const executeSubmit = async () => {
    setIsSubmitting(true);
    closeModal();
    try {
      const formattedAnswers = Object.entries(answers).map(([qId, ansVal]) => ({
        questionId: qId,
        studentAnswer: String(ansVal),
      }));

      const res = await submitExam({
        attemptId,
        answers: formattedAnswers,
      });

      toast.success("Exam submitted successfully!");
      // Navigate to results page immediately
      const resultAttemptId = res?.data?.attemptId || attemptId;
      navigate(`/student/exam-results/${resultAttemptId}`);
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.message || "Failed to submit exam");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExit = () => {
    openModal('confirmExitExam');
  };

  return {
    navigate,
    currentIndex,
    setCurrentIndex,
    answers,
    flagged,
    isSubmitting,
    activeModal,
    closeModal,
    questions,
    examInfo,
    isLoading,
    timeLeft,
    currentQuestion,
    handleAnswerChange,
    handleToggleFlag,
    handleSubmitClick,
    executeSubmit,
    handleExit,
  };
}
