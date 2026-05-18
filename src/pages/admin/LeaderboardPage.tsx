import { seedAlumni } from "@/data/seedData";

const LeaderboardPage: React.FC = () => {
  const top = seedAlumni
    .slice()
    .sort((a, b) => (b.contributionScore || 0) - (a.contributionScore || 0))
    .slice(0, 10);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Leaderboard</h1>
      <div className="grid gap-2">
        {top.map((a) => (
          <div key={a.id} className="p-4 border rounded">
            <div className="font-semibold">{a.name}</div>
            <div className="text-sm text-muted-foreground">Score: {a.contributionScore} • Students helped: {a.studentsHelped}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaderboardPage;
