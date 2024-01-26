"use client";

import Menu from "@/components/Menu"
import { useState, useEffect } from "react"

export default function Scoreboard() {
    const [wonGames, setWonGames] = useState(0)
    const [lostGames, setLostGames] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setWonGames(Number(localStorage.getItem('wonGames') || 0))
        setLostGames(Number(localStorage.getItem('lostGames') || 0))
        setLoading(false)
    }, [])

    if(loading) return (
        <div>
            <Menu />
            <p className="text-center text-2xl p-3">My Score</p>
            <div className="flex justify-center items-center">
                <div className="flex w-3/4">
                    <div className="grid flex-grow skeleton h-20 place-items-center text-green-500"></div>
                    <div className="divider divider-horizontal"></div>
                    <div className="grid flex-grow skeleton h-20 place-items-center text-red-500"></div>
                </div>
            </div>
        </div>
    )


    return (
        <div>
            <Menu />
            <p className="text-center text-2xl p-3">My Score</p>
            <div className="flex justify-center items-center">
                <div className="flex w-3/4">
                    <div className="grid h-20 flex-grow card bg-base-300 rounded-box place-items-center text-green-500">{wonGames}</div>
                    <div className="divider divider-horizontal"></div>
                    <div className="grid h-20 flex-grow card bg-base-300 rounded-box place-items-center text-red-500">{lostGames}</div>
                </div>
            </div>
        </div>
    )
}