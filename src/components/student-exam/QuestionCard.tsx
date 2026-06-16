import type { Question } from '../../types/exam';
import { QuestionTitle } from './QuestionTitle';
import { QuestionOptions } from './QuestionOptions';

interface QuestionCardProps {
  question: Question;
  number: number;
  answer: any;
  onChange: (answer: any) => void;
}

export function QuestionCard({ question, number, answer, onChange }: QuestionCardProps) {
  return (
    <div className="border-2 border-gray-400 dark:border-gray-600 bg-white dark:bg-[#111] text-gray-900 dark:text-gray-100 rounded-2xl p-8 shadow-sm h-full flex flex-col" dir="auto">
      <QuestionTitle number={number} text={question.text} points={question.points} />

      <div className="flex-1 mt-6">
        {question.type === 'Multiple Choice' && question.options && (
          <QuestionOptions
            options={question.options}
            selectedId={answer}
            onChange={onChange}
          />
        )}

        {question.type === 'True/False' && (
          <QuestionOptions
            options={[{ id: 'True', text: 'True' }, { id: 'False', text: 'False' }]}
            selectedId={answer}
            onChange={onChange}
          />
        )}
      </div>
    </div>
  );
}
