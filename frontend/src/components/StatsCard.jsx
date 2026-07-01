function StatsCard({ title, value, subtitle }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">

      <p className="text-gray-500 text-sm mb-2">
        {title}
      </p>

      <h2 className="text-3xl font-bold">
        {value}
      </h2>

      <p className="text-gray-400 text-sm mt-2">
        {subtitle}
      </p>

    </div>
  );
}

export default StatsCard;