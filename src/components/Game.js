import React, { useState, useEffect } from 'react'
import Board from './Board'
import { useQuery } from '@tanstack/react-query';
import { SkeletonBoard, SkeletonButton, SkeletonNumShuffle } from '../lib/skeletonLoading';
import { Crown, LoaderCircle, RefreshCcw, RotateCcw } from 'lucide-react';
import { useMathStore } from '../store/useMathStore';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import { cn } from '../lib/utils';
import { shuffleNum } from '../lib/shuffleNum';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
} from '@chakra-ui/react'

const Droppable = ({ id, children }) => {
    const { setNodeRef } = useDroppable({ id });
    return (
        <div ref={setNodeRef} className="droppable h-full w-full flex justify-center">
            {children}
        </div>
    );
};

const Draggable = ({ id, number }) => {
    const { current } = useMathStore()
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id, data: {
            number
        }
    });
    const style = !current && transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
        <div ref={setNodeRef} className={cn('hover:bg-gray-500 bg-black text-white size-10 flex justify-center items-center rounded-md',)} style={style} {...listeners} {...attributes}>
            <span className='text-2xl'>{number}</span>
        </div>
    );
};

const Number = ({ number, callback }) => {

    return (
        <button onClick={() => {
            callback(number)
        }} className={cn("bg-black hover:bg-gray-500 hover:z-40 z-30 hover:cursor-pointer flex justify-center items-center w-10 h-10 text-white text-2xl p-2.5 text-center rounded-md")}>
            <span>{number.result}</span>
        </button>
    )
}

const NotifDialog = ({ open, onClose, onPlayAgain }) => {
    return (
        <Modal isOpen={open} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader></ModalHeader>
                <ModalBody>
                    <h2 className='text-2xl font-bold text-green-500 mb-4'>Congratulations,</h2>
                    <p className='"text-lg mb-6 flex gap-2'>
                        <Crown />
                        You Win!!!!
                        <Crown />
                    </p>
                </ModalBody>

                <ModalFooter>
                    <div className='w-full flex justify-center'>
                        <button className='bg-slate-500 focus-visible:outline-none flex items-center shadow-md text-white font-semibold py-2 px-4 rounded hover:bg-blue-400 transition duration-300' onClick={onPlayAgain}>
                            <RotateCcw size={18} className='mr-2' />
                            New Game
                        </button>
                    </div>

                </ModalFooter>
            </ModalContent>
        </Modal>
    )
};

const Game = ({ math, handleNewGame }) => {
    const { setCurrent, current, setCorrect, resetCorrect } = useMathStore()

    const [win, setWin] = useState(false)
    const [level, setLevel] = useState('easy')
    const [renderMath, setRenderMath] = useState(math)
    const { data, isLoading, refetch, isRefetching } = useQuery({
        queryKey: ['image'],
        queryFn: async () => {
            return await fetch('https://picsum.photos/500/375')
        },
        refetchOnWindowFocus: false
    })

    const handleShuffleMath = (math) => {
        const shuffled = shuffleNum(math)
        setRenderMath(shuffled)
    }

    useEffect(() => {
        if (!renderMath.length) return
        const checkWin = () => {
            return renderMath.every(item => item === null)
        }
        if (checkWin()) setWin(true)
    }, [renderMath])

    useEffect(() => {
        handleShuffleMath(math)
    }, [math])


    if (isLoading) return (
        <div className='h-full w-full flex flex-col'>
            <div className='absolute flex gap-2'>
                <SkeletonButton />
                <SkeletonButton />
                <SkeletonButton />
            </div>
            <div className='h-[55%] flex justify-center items-center mb-2'>
                <SkeletonBoard />
            </div>
            <SkeletonNumShuffle />
        </div>
    )

    if (isRefetching) return (
        <div className='h-full w-full flex flex-col'>
            <button disabled className='absolute flex gap-2 justify-center items-center px-4 py-2 bg-blue-600 text-white rounded-md shadow-md cursor-wait'>
                <LoaderCircle className='animate-spin' size={18} />
                <span>New Game</span>
            </button>
            <div className='h-[55%] flex justify-center items-center mb-2'>
                <SkeletonBoard />
            </div>
            <SkeletonNumShuffle />
        </div>
    )


    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!active || !over) return;
        if (active.data.current.number === over.data.current.result) {
            setCorrect({
                id: parseInt(over.id.split('-')[1]),
                result: over.data.current.result
            })
            setCurrent(null)
            let removeIndex = active.id - 1
            const newMath = renderMath.map(item => item?.id === removeIndex ? null : item)
            setRenderMath(newMath)
            if (level === 'hard') handleShuffleMath(newMath)
        } else {
            alert('Wrong answer')
        }
    };

    const handleNewGameClick = () => {
        handleNewGame()
        refetch()
        setCurrent(null)
        resetCorrect()
    }

    const handleEasyClick = () => {
        if (level === 'easy') return alert('You are already on easy level')
        setLevel('easy')
        handleNewGameClick()
    }

    const handleHardClick = () => {
        if (level === 'hard') return alert('You are already on hard level')
        setLevel('hard')
        handleNewGameClick()
    }

    const checkAnswer = (answer) => {
        if (!current) return alert('Please select a math problem first or drag me to it')
        let res = answer.result === current.result

        if (res) {
            setCorrect({
                id: current.id,
                result: current.result
            })
            setCurrent(null)
            const newMath = renderMath.map(item => item?.id === answer.id ? null : item)
            setRenderMath(newMath)
            if (level === 'hard') handleShuffleMath(newMath)
        } else alert('Wrong answer')
    }

    return (
        <div className='h-full relative w-full flex flex-col'>
            <div className='absolute flex w-1/2 gap-4'>
                <button onClick={handleNewGameClick} className=' px-4 py-2 bg-blue-500 text-white rounded-md shadow-md transition-colors hover:bg-blue-400'>New Game</button>
                <button onClick={handleEasyClick} className={cn('px-4 py-2 min-w-24 rounded-md shadow-md bg-green-200 text-white', level === 'easy' && 'bg-green-400')}>Easy</button>
                <button onClick={handleHardClick} className={cn('px-4 py-2 min-w-24 rounded-md shadow-md bg-red-200 text-white', level === 'hard' && 'bg-red-400')}>Hard</button>
            </div>
            <DndContext onDragEnd={handleDragEnd}>
                <div className='h-[55%] flex justify-center items-center mb-2'>
                    <Droppable id="droppable-1">
                        <Board math={math} url={data?.url} />
                    </Droppable>
                </div>
                <div className='h-[45%] w-full'>
                    <div className={cn(
                        ' w-full p-2 h-full border-2 border-solid relative border-gray-400 rounded-r-lg rounded-b-lg  gap-5 ',
                        'flex justify-center items-center'
                    )}>
                        <button onClick={() => handleShuffleMath(renderMath)} className='absolute -top-10 left-0 bg-blue-500 hover:cursor-pointer hover:bg-blue-400 text-white p-2 rounded-t-md'>
                            <RefreshCcw size={24} />
                        </button>

                        {
                            renderMath.map((number, index) => {
                                if (!number) return <div className='invisible size-10' />
                                return (
                                    current ? (
                                        <Number key={number.id} number={number} callback={checkAnswer} />
                                    ) : (
                                        <Draggable key={number.id} id={number.id + 1} number={number.result} />
                                    )

                                );
                            })
                        }
                    </div>

                </div>
            </DndContext>
            <NotifDialog open={win} onClose={() => setWin(false)} onPlayAgain={() => {
                handleNewGameClick()
                setWin(false)
            }} />
        </div>
    )
}



export default Game