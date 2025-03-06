import Link from "next/link"
import { PlusCircle, Search, Filter, Clock, Users } from "lucide-react"

// Mock data for scenarios
const scenarios = [
  {
    id: "1",
    title: "失われた遺跡の秘宝",
    description: "古代文明の遺跡で眠る秘宝を求めて冒険者たちが集まる。しかし、遺跡には古代の呪いが...",
    createdAt: "2023-10-15",
    players: 3,
    tags: ["ファンタジー", "冒険", "謎解き"],
  },
  {
    id: "2",
    title: "星間航路の迷子",
    description: "宇宙船の故障により未知の惑星に不時着した乗組員たち。生存と脱出のために奮闘する物語。",
    createdAt: "2023-11-20",
    players: 2,
    tags: ["SF", "サバイバル", "宇宙"],
  },
  {
    id: "3",
    title: "霧の街の怪事件",
    description: "霧に包まれた街で起こる連続怪事件。真相を追う探偵の物語。",
    createdAt: "2023-12-05",
    players: 4,
    tags: ["ミステリー", "ホラー", "推理"],
  },
]

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-amber-800">あなたのシナリオ</h1>
          <p className="text-stone-600">作成したシナリオを管理・編集できます</p>
        </div>

        <Link href="/create" className="btn btn-primary">
          <PlusCircle className="mr-2 h-4 w-4" />
          新規シナリオ作成
        </Link>
      </div>

      {/* Search and filter */}
      <div className="card p-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input type="text" placeholder="シナリオを検索..." className="input pl-10 w-full" />
          </div>
          <button className="btn btn-outline flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            フィルター
          </button>
        </div>
      </div>

      {/* Scenarios list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scenarios.map((scenario) => (
          <div key={scenario.id} className="card overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-5 border-b">
              <h3 className="text-lg font-serif font-bold text-amber-800 mb-2">{scenario.title}</h3>
              <p className="text-stone-600 text-sm line-clamp-2 mb-3">{scenario.description}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {scenario.tags.map((tag, index) => (
                  <span key={index} className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-stone-500">
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{scenario.createdAt}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-3 w-3 mr-1" />
                  <span>{scenario.players}人参加中</span>
                </div>
              </div>
            </div>
            <div className="bg-stone-50 p-3 flex justify-between">
              <Link
                href={`/scenario/${scenario.id}`}
                className="text-sm text-amber-700 hover:text-amber-800 font-medium"
              >
                詳細を見る
              </Link>
              <Link href={`/scenario/${scenario.id}/edit`} className="text-sm text-stone-600 hover:text-stone-800">
                編集する
              </Link>
            </div>
          </div>
        ))}

        {/* Create new scenario card */}
        <Link
          href="/create"
          className="card flex flex-col items-center justify-center p-6 border-dashed border-2 hover:bg-amber-50 transition-colors"
        >
          <PlusCircle className="h-12 w-12 text-amber-600 mb-4" />
          <span className="text-amber-700 font-medium">新規シナリオを作成</span>
        </Link>
      </div>
    </div>
  )
}

