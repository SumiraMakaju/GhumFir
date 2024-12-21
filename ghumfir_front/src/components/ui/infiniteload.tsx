import {useInView} from 'react-intersection-observer';
import React from 'react';

interface infiniteloadProps extends React.PropsWithChildren{
    onBottomReached: () => void;
    className?: string;
}

export default function InfiniteLoad({
    children,
    onBottomReached,
    className}: infiniteloadProps){
        const { ref }  = useInView({
            rootMargin: "200px",
            onChange(inView){
                if(inView){
                    onBottomReached();
                }
            },
        });

        return (<div className={className}>
            {children}
            <div ref={ref} ></div>
        </div>
        );
}