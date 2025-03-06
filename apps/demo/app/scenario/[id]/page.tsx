import Link from "next/link"
import { ArrowLeft, Clock, Users, Tag, Share2 } from "lucide-react"

// Mock data for scenario
const scenario = {
  id: "1",
  title: "失われた遺跡の秘宝",
  description:
    "古代文明の遺跡で眠る秘宝を求めて冒険者たちが集まる。しかし、遺跡には古代の呪いが潜んでいた。あなたは秘宝を手に入れることができるだろうか？それとも呪いに飲み込まれてしまうのか？",
  createdAt: "2023-10-15",
  updatedAt: "2023-12-20",
  players: 3,
  difficulty: "普通",
  tags: ["ファンタジー", "冒険", "謎解き"],
  author: "GameMaster01",
  content: `あなたは古代遺跡の入り口に立っています。苔むした石柱が両側に並び、不気味な雰囲気を醸し出しています。入り口の奥には暗闇が広がっています。

どうしますか？`,
  choices: [
    {
      id: "choice1",
      text: "松明を灯して中に入る",
      nextSceneId: "scene2",
    },
    {
      id: "choice2",
      text: "入り口周辺を調査する",
      nextSceneId: "scene3",
    },
    {
      id: "choice3",
      text: "引き返す",
      nextSceneId: "scene4",
    },
  ],
}

export default function ScenarioView({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/dashboard" className="inline-flex items-center text-amber-700 hover:text-amber-800 mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" />
        シナリオ一覧に戻る
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2">
          <div className="card p-6 mb-6">
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-amber-800 mb-4">{scenario.title}</h1>

            <div className="flex flex-wrap gap-2 mb-4">
              {scenario.tags.map((tag, index) => (
                <span key={index} className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>

            <p className="text-stone-600 mb-6">{scenario.description}</p>

            <div className="flex flex-wrap gap-4 text-sm text-stone-500 mb-6">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>作成日: {scenario.createdAt}</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>{scenario.players}人参加中</span>
              </div>
              <div className="flex items-center">
                <Tag className="h-4 w-4 mr-1" />
                <span>難易度: {scenario.difficulty}</span>
              </div>
            </div>

            <div className="flex justify-between">
              <button className="btn btn-primary">プレイを開始する</button>
              <button className="btn btn-outline">
                <Share2 className="mr-2 h-4 w-4" />
                共有する
              </button>
            </div>
          </div>

          {/* Preview section */}
          <div className="card p-6">
            <h2 className="text-xl font-serif font-bold text-amber-800 mb-4">プレビュー</h2>

            <div className="bg-stone-50 p-6 rounded-lg border border-stone-200 mb-6 paper-texture">
              <p className="text-stone-700 mb-6 whitespace-pre-line">{scenario.content}</p>

              <div className="space-y-3">
                <h3 className="text-sm font-medium text-stone-600">選択肢:</h3>
                {scenario.choices.map((choice) => (
                  <div
                    key={choice.id}
                    className="p-3 bg-white border border-stone-200 rounded-md hover:bg-amber-50 cursor-pointer transition-colors"
                  >
                    {choice.text}
                  </div>
                ))}
              </div>
            </div>

            <p className="text-sm text-stone-500 italic">
              これはシナリオの冒頭部分のプレビューです。実際のプレイでは選択肢によって物語が分岐します。
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-6 mb-6">
            <h2 className="text-lg font-serif font-medium text-amber-800 mb-4">作者情報</h2>

            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                <span className="text-amber-800 font-bold">{scenario.author.charAt(0)}</span>
              </div>
              <div>
                <p className="font-medium">{scenario.author}</p>
                <p className="text-sm text-stone-500">シナリオ作成者</p>
              </div>
            </div>

            <Link href="#" className="text-sm text-amber-700 hover:text-amber-800">
              作者の他のシナリオを見る
            </Link>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-serif font-medium text-amber-800 mb-4">シナリオ情報</h2>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-500">作成日</span>
                <span className="font-medium">{scenario.createdAt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">最終更新日</span>
                <span className="font-medium">{scenario.updatedAt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">推奨プレイヤー数</span>
                <span className="font-medium">1人</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">難易度</span>
                <span className="font-medium">{scenario.difficulty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">プレイ時間</span>
                <span className="font-medium">約30分</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">分岐数</span>
                <span className="font-medium">12</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

