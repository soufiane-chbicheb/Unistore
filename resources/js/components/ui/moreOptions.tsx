import { MouseEvent, useEffect, useRef } from "react"




export default function MoreOptions  ({children}:{children : React.ReactNode}) {
    const moreOptionsModelRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
     const handleClickOutside = (e: Event) => {
    if (!moreOptionsModelRef.current) return;

    if (!moreOptionsModelRef.current.contains(e.target as Node)) {
      moreOptionsModelRef.current.style.display = "none";
    }
  };

      window.addEventListener('click' , handleClickOutside )
     return () =>  window.removeEventListener('click' , handleClickOutside)
     }, []);

    return (
                           <>           
                            <div ref={moreOptionsModelRef} className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                               {children}
                            </div>
                          </>
    )
}
