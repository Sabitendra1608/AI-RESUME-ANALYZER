function ATSScoreCard({ score }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">

      <div className="flex justify-between items-center mb-4">

        <h2 className="text-2xl font-semibold">
          ATS Score
        </h2>

        <span className="text-green-600 font-semibold">
          Good
        </span>

      </div>

      <div className="text-6xl font-bold text-blue-600 mb-6">
        {score}
      </div>

      <div className="w-full bg-gray-200 rounded-full h-4">
        <div
          className="bg-blue-600 h-4 rounded-full"
          style={{ width: `${score}%` }}
        />
      </div>

      <p className="mt-4 text-gray-500">
        Your resume performs better than most student resumes.
      </p>

    </div>
  );
}

export default ATSScoreCard;