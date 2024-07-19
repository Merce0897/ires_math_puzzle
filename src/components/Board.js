import React, { useEffect, useCallback, useState } from 'react'
import { makeHeights } from '../lib/generateBoardHeight';
import { SkeletonBoard } from '../lib/skeletonLoading';
import { useMathStore } from '../store/useMathStore';
import { cn } from '../lib/utils'
import { Droppable } from '../lib/dragItem';

const Board = ({ math, url }) => {
    const { setCurrent, correct, current } = useMathStore()
    const [elementHeight, setElemenHeight] = useState(0)
    const [heights, setHeights] = useState([])
    const [mathProblems, setMathProblems] = useState([])
    const [imageLoaded, setImageLoaded] = useState(false);
    const [currentMath, setCurrentMath] = useState(null)

    const parentRef = useCallback(node => {
        if (node !== null) {
            const element = node.getBoundingClientRect();
            setElemenHeight(element.height);
        }
    }, [])

    useEffect(() => {
        const img = new Image();
        img.src = url;
        img.onload = () => setImageLoaded(true);
    }, [url])

    useEffect(() => {
        const getMath = () => {
            let temp = []
            math.map((math, index) => {
                const newMath = `${math.number1} ${math.operator} ${math.number2} = `
                return temp.push(newMath)
            })
            setMathProblems(temp)
        }
        if (!mathProblems.length) getMath()

    }, [mathProblems.length, math])

    useEffect(() => {
        const layout = [3, 4, 3, 4]
        const getHeights = () => {
            if (!elementHeight) return
            const res = makeHeights({ elementHeight, layout })
            setHeights(res)
        }
        if (!heights.length) getHeights()
    }, [heights.length, elementHeight])

    const chooseMath = (mathItem) => {
        console.log(mathItem, current);
        if (current) {
            if (mathItem.id === current.id) {
                setCurrentMath(null)
                setCurrent(null)
            } else {
                setCurrentMath(mathItem.id)
                setCurrent(mathItem)
            }

        }
        else {
            setCurrentMath(mathItem.id)
            setCurrent(mathItem)
        }

    }

    return (
        imageLoaded ? (
            <div ref={parentRef} className="h-full w-1/3 flex border-4 relative border-solid border-gray-500 mb-4">

                <img src={url} className='h-full w-full absolute' alt="" />
                {
                    heights.map((row, colIndex) => {
                        return (
                            <div key={colIndex} className="w-1/4 h-full relative">
                                {
                                    row.map((height, rowIndex) => {
                                        const currentIndex = height.id - 1
                                        const answered = correct.some(item => item.id === currentIndex)
                                        return (
                                            !answered && (

                                                <button key={height.id}
                                                    onClick={() => chooseMath(math[currentIndex])}
                                                    style={{ height: height.height + 'px', top: height.top + 'px' }}
                                                    className={cn(
                                                        'bg-white/80 hover:border-2 absolute flex border border-solid border-gray-400 hover:cursor-pointer justify-center items-center w-full',
                                                        currentMath === currentIndex && 'bg-yellow-400'
                                                    )}>
                                                    <Droppable key={currentIndex} id={currentIndex} number={math[currentIndex].result}>
                                                        <span>{mathProblems[currentIndex]}</span>
                                                    </Droppable>
                                                </button>


                                            )
                                        )
                                    })
                                }
                            </div>
                        )
                    })
                }

            </div >
        )
            : (
                <SkeletonBoard />
            )
    )
}

export default Board