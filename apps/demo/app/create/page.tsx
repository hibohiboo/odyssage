"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Save, X, Tag, ArrowLeft } from "lucide-react"

export default function CreateScenario() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddTag()
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/dashboard" className="inline-flex items-center text-amber-700 hover:text-amber-800 mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" />
        シナリオ一覧に戻る
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-amber-800">新規シナリオ作成</h1>

        <button className="btn btn-primary">
          <Save className="mr-2 h-4 w-4" />
          保存する
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main form */}
        <div className="lg:col-span-2">
          <div className="card p-6 mb-6">
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-stone-700 mb-1">
                シナリオタイトル
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="冒険の名前を入力してください"
                className="input w-full"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-stone-700 mb-1">
                シナリオ概要
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="シナリオの概要や背景を入力してください"
                className="textarea w-full"
                rows={5}
              />
            </div>
          </div>

          <div className="card p-6 mb-6">
            <h2 className="text-lg font-serif font-medium text-amber-800 mb-4">タグ</h2>

            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag, index) => (
                <div key={index} className="flex items-center bg-amber-50 text-amber-700 px-3 py-1 rounded-full">
                  <span>{tag}</span>
                  <button onClick={() => handleRemoveTag(tag)} className="ml-2 text-amber-500 hover:text-amber-700">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}

              {tags.length === 0 && <p className="text-sm text-stone-500">タグを追加してシナリオを分類しましょう</p>}
            </div>

            <div className="flex">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="新しいタグを追加"
                className="input flex-1 mr-2"
              />
              <button onClick={handleAddTag} className="btn btn-outline">
                <Tag className="mr-2 h-4 w-4" />
                追加
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-6 mb-6">
            <h2 className="text-lg font-serif font-medium text-amber-800 mb-4">シナリオ設定</h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-stone-700 mb-1">
                  難易度
                </label>
                <select id="difficulty" className="input w-full">
                  <option value="easy">簡単</option>
                  <option value="normal">普通</option>
                  <option value="hard">難しい</option>
                  <option value="very-hard">非常に難しい</option>
                </select>
              </div>

              <div>
                <label htmlFor="players" className="block text-sm font-medium text-stone-700 mb-1">
                  推奨プレイヤー数
                </label>
                <select id="players" className="input w-full">
                  <option value="1">1人</option>
                  <option value="2-3">2〜3人</option>
                  <option value="4-5">4〜5人</option>
                  <option value="6+">6人以上</option>
                </select>
              </div>

              <div>
                <label htmlFor="visibility" className="block text-sm font-medium text-stone-700 mb-1">
                  公開設定
                </label>
                <select id="visibility" className="input w-full">
                  <option value="public">公開</option>
                  <option value="unlisted">限定公開（URLを知っている人のみ）</option>
                  <option value="private">非公開（自分のみ）</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-serif font-medium text-amber-800 mb-4">ヒント</h2>

            <div className="text-sm text-stone-600 space-y-3">
              <p>✓ シナリオのタイトルは魅力的で記憶に残るものにしましょう</p>
              <p>✓ 概要は簡潔に、プレイヤーの興味を引く内容を心がけましょう</p>
              <p>✓ タグを追加すると、シナリオが検索されやすくなります</p>
              <p>✓ シナリオを保存した後、フローチャートエディタでストーリーの分岐を作成できます</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

