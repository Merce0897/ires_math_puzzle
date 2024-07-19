import { useDraggable, useDroppable } from '@dnd-kit/core'
import { cn } from './utils';

export const Droppable = ({ id, number, children }) => {
    const name = `droppable-${id}-${number}`
    const { setNodeRef, over } = useDroppable({
        id: name, data: {
            result: number
        }
    });

    return (
        <div ref={setNodeRef} className={cn("flex h-full w-full justify-center", over?.id === name && 'bg-green-400')}>
            {children}
        </div>
    );
};

export const Draggable = ({ id, children }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
            {children}
        </div>
    );
};