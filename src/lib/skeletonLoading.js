import React from 'react'

export const SkeletonBoard = () => {
    return (
        <div className='h-full w-1/3 bg-slate-400 animate-pulse' />
    )
}

export const SkeletonNumShuffle = () => {
    return (
        <div className='h-[45%] w-full'>
            <div className='h-full w-full bg-slate-400 animate-pulse'></div>
        </div>
    )
}

export const SkeletonButton = () => {
    return (
        <div className='w-[6.5rem] h-10 rounded-md bg-slate-400 animate-pulse' />
    )
}