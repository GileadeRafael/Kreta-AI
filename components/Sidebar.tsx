import React from 'react';
import { HomeIcon } from './icons/HomeIcon';
import { SearchIcon } from './icons/SearchIcon';
import { CameraIcon } from './icons/CameraIcon';
import { ImageIcon } from './icons/ImageIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import { UsersIcon } from './icons/UsersIcon';
import { FileIcon } from './icons/FileIcon';
import { ListIcon } from './icons/ListIcon';

const sidebarIcons = [
    { icon: <HomeIcon className="w-6 h-6"/>, active: false },
    { icon: <SearchIcon className="w-6 h-6"/>, active: false },
    { icon: <CameraIcon className="w-6 h-6"/>, active: false },
    { icon: <ImageIcon className="w-6 h-6"/>, active: true },
    { icon: <SettingsIcon className="w-6 h-6"/>, active: false },
    { icon: <UsersIcon className="w-6 h-6"/>, active: false },
    { icon: <FileIcon className="w-6 h-6"/>, active: false },
    { icon: <ListIcon className="w-6 h-6"/>, active: false },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-16 bg-[#1c1c1c] border-r border-[#2d2d3d] flex flex-col items-center py-4">
      <nav className="flex flex-col items-center space-y-2">
        {sidebarIcons.map((item, index) => (
          <button
            key={index}
            className={`p-3 rounded-lg transition-colors duration-200 ${
              item.active
                ? 'bg-sky-500/20 text-sky-400'
                : 'text-neutral-500 hover:bg-neutral-700 hover:text-neutral-300'
            }`}
          >
            {item.icon}
          </button>
        ))}
      </nav>
    </aside>
  );
};