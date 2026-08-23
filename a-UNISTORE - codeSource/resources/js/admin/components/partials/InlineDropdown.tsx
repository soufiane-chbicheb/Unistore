import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';

export default function InlineDropdown({ item, isActive ,isOpen , onToggle}: {onToggle : (title:string) => void ; item: any; isActive: boolean  ; isOpen: boolean }) {
  const { url } = usePage();
 
  return (
    <div className="flex flex-col mb-2">
      {/* Parent Link */}
      <button
        onClick={() => {onToggle(item.title) }}
        className={`
          px-4 py-3 rounded-lg flex items-center gap-3 justify-between
          transition-all duration-200 ease-in-out mb-1
          ${isActive 
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
            : 'text-gray-300 hover:bg-gray-800 hover:text-white hover:shadow-md'
          }
        `}
      > 
        <div className="flex items-center gap-3">
          <item.icon className="h-5 w-5" />
          <span className="font-medium">{item.title}</span>
        </div>
        <ChevronDown 
          size={16} 
          className={`transition-transform duration-200 ${ isOpen  ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Sublinks - Indented Level 2 */}
      {isOpen && item.subLinks && item.subLinks.length > 0 && (
        <div className="ml-6 mt-2 mb-1 border-l-2 border-gray-700 pl-3 flex flex-col gap-2">
          {item.subLinks.map((sublink: any, index: number) => {
            const isSubActive = url.endsWith(sublink.href);
            
            return (
              <Link
                key={index}
                href={sublink.href}
                className={`
                  flex items-center gap-3 px-4 py-2.5 rounded-lg
                  transition-all duration-200 ease-in-out
                  text-sm group
                  ${isSubActive
                    ? 'bg-gray-800 text-white font-medium shadow-md '
                    : 'text-gray-400 hover:bg-gray-800/60 hover:text-white hover:shadow-md hover:scale-[1.02]'
                  }
                `}
              >
                <div className={`
                  p-1.5 rounded-md transition-colors duration-200
                  ${isSubActive 
                    ? 'bg-gray-700 text-gray-200' 
                    : 'bg-gray-700/50 text-gray-400 group-hover:bg-gray-700 group-hover:text-gray-200'
                  }
                `}>
                  <sublink.icon className="w-4 h-4 flex-shrink-0" />
                </div>
                <span className="flex-1">{sublink.title}</span>
                {isSubActive && (
                  <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
