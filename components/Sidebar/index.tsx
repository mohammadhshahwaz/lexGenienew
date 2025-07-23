

// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import { usePathname } from "next/navigation";
// import Link from "next/link";
// import Image from "next/image";
// import { Folder, FileText, Database, Briefcase, ArrowLeft, ArrowRight } from "lucide-react";
// import SidebarItem from "@/components/Sidebar/SidebarItem";
// import ClickOutside from "@/components/ClickOutside";


// interface SidebarProps {
//   sidebarOpen: boolean;
//   setSidebarOpen: (arg: boolean) => void;
// }

// const menuGroups = [
//   {
//     name: "SERVICES",
//     menuItems: [
//       {
//         icon: <Briefcase size={18} />,
//         label: "Civil Law",
//         route: "#",
//         children: [
//           { label: "BNS Search", route: "/bns-search" },
//           { label: "HeadNote Generation", route: "/headnote-generation" },
//           { label: "Summarizer", route: "/summarizer" },
//           { label: "Legal Assistant", route: "/legal-assistant" },
//           { label: "Lex Citation", route: "/lex-citation" }
//         ],
//       },
//       {
//         icon: <Folder size={18} />,
//         label: "Corporate Law",
//         route: "#",
//         children: [
//           { label: "AI Contract Navigator", route: "/ai-contract-navigator" },
//           { label: "Legal Lens", route: "/legal-lens" },
//           { label: "Summarise Contract", route: "/summarise-contract" },
//           { label: "Compare Contract", route: "/compare-contract" },
//         ],
//       },
//     ],
//   },
//   {
//     name: "OTHERS",
//     menuItems: [
//       {
//         icon: <Database size={18} />,
//         label: "Storage",
//         route: "/storage",
//       },
//       {
//         icon: <FileText size={18} />,
//         label: "Profile",
//         route: "/profile",
//       },
//     ],
//   },
// ];

// const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
//   const pathname = usePathname();
//   // const [pageName, setPageName] =();

//   return (
//     <ClickOutside onClick={() => setSidebarOpen(false)}>
//       <aside
//         className={`fixed left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-white duration-300 ease-linear dark:bg-boxdark ${
//           sidebarOpen ? "translate-x-0" : "-translate-x-full"
//         }`}
//       >
//         {/* <!-- SIDEBAR HEADER --> */}
//         <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
//           <Link href="/">
//             <Image
//               width={176}
//               height={32}
//               src={"/images/logo/logo_lex.png"}
//               alt="Logo"
//               priority
//             />
//           </Link>

//           <button
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//             aria-label={sidebarOpen ? "Close Sidebar" : "Open Sidebar"}
//             className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition"
//           >
//             {sidebarOpen ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
//           </button>
//         </div>
//         {/* <!-- SIDEBAR HEADER --> */}

//         <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
//           {/* <!-- Sidebar Menu --> */}
//           <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
//             {menuGroups.map((group, groupIndex) => (
//               <div key={groupIndex}>
//                 <h2 className="mb-4 ml-4 text-sm font-semibold text-black">
//                   {group.name}
//                 </h2>

//                 <ul className="mb-6 flex flex-col gap-1.5">
//                   {group.menuItems.map((menuItem, menuIndex) => (
//                     <SidebarItem
//                       key={menuIndex}
//                       item={menuItem}
                    
//                     />
//                   ))}
//                 </ul>
//               </div>
//             ))}
//           </nav>
//           {/* <!-- Sidebar Menu --> */}
//         </div>
//       </aside>
//     </ClickOutside>
//   );
// };

// export default Sidebar;

import React, { JSX, useState } from 'react';
import {  ChevronDown, ChevronRight, Database, FileText, ChevronLeft, } from 'lucide-react';

interface MenuItem {
  icon: JSX.Element;
  label: string;
  route: string;
  children?: { label: string; route: string }[];
}

interface MenuGroup {
  name: string;
  menuItems: MenuItem[];
}

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const menuGroups: MenuGroup[] = [
    {
      name: "SERVICES",
      menuItems: [
        {
          // icon: <Briefcase size={20} />,
          icon:<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className="w-5 h-5"><path d="M32 4L4 16v8h56v-8L32 4zm-12 28h-8v24h8V32zm16 0h-8v24h8V32zm16 0h-8v24h8V32zM4 60h56v-4H4v4z" fill="currentColor" /></svg>,
          label: "Civil Law",
          route: "#",
          children: [
            { label: "BNS Search", route: "/bns-search" },
            { label: "HeadNote Generator", route: "/headnote-generation" },
            { label: "Summarizer", route: "/summarizer" },
            { label: "Legal Assistant", route: "/legal-assistant" },
            { label: "Lex Citation", route: "/lex-citation" }
          ],
        },
        {
          // icon:  <Building2  size={20} />,
          icon:  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className="w-5 h-5"><path d="M60 20H48v-8c0-2.2-1.8-4-4-4H20c-2.2 0-4 1.8-4 4v8H4c-2.2 0-4 1.8-4 4v32c0 2.2 1.8 4 4 4h56c2.2 0 4-1.8 4-4V24c0-2.2-1.8-4-4-4zM20 12h24v8H20v-8zm32 40H12V28h40v24z" fill="currentColor" /></svg>,
          label: "Corporate Law",
          route: "#",
          children: [
            { label: "AI Contract Navigator", route: "/ai-contract-generator" },
            { label: "Legal Lens", route: "/legal-lens" },
            { label: "Summarise Contract", route: "/summarise-contract" },
            { label: "Compare Contract", route: "/compare-contract" },
          ],
        },
      ],
    },
    {
      name: "OTHERS",
      menuItems: [
        {
          icon: <Database size={20} />,
          label: "Storage",
          route: "/storage",
        },
        {
          icon: <FileText size={20} />,
          label: "Profile",
          route: "/profile",
        },
      ],
    },
  ];

  const toggleSidebar = (): void => setIsOpen(!isOpen);

  const toggleGroup = (groupName: string): void => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  return (
    <div className="flex h-screen">
           {/* Sidebar */}
           <div className={`${isOpen ? 'w-64' : 'w-16'} bg-gray-100 transition-all duration-300 ease-in-out flex flex-col border-r relative`}>
        {/* Logo and Toggle Section */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className={`flex items-center ${!isOpen ? 'justify-center w-full' : ''}`}>
            <div className={`flex items-center ${!isOpen ? 'w-8 h-8' : 'h-8'}`}>
            {/* {isOpen && (
              <img 
                src="/logo_lex.png" 
                alt="Lex Genie"
                className="object-contain"
              />
            )} */}
             
            </div>
          </div>
          <button
            onClick={toggleSidebar}
            className={`hover:bg-gray-200 rounded-full p-1 ${!isOpen ? 'absolute -right-3 bg-white shadow-md' : ''}`}
          >
            {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        {/* Sidebar content */}
        <div className="flex-1 overflow-y-auto">
          {menuGroups.map((group) => (
            <div key={group.name} className="py-2">
              {isOpen && (
                <div className="text-xs font-semibold text-gray-500 px-4 py-2">{group.name}</div>
              )}
              {group.menuItems.map((item) => (
                <div key={item.label}>
                  <button
                    onClick={() => item.children && isOpen && toggleGroup(item.label)}
                    className={`w-full text-left py-2 hover:bg-gray-200 flex items-center justify-center ${isOpen ? 'px-4' : 'px-2'}`}
                    title={!isOpen ? item.label : ''}
                  >
                    <div className={`flex items-center ${isOpen ? 'w-full justify-between' : 'justify-center'}`}>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-600">{item.icon}</span>
                        {isOpen && <span className="text-gray-700">{item.label}</span>}
                      </div>
                      {isOpen && item.children && (
                        expandedGroups[item.label] ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                      )}
                    </div>
                  </button>
                  {/* Submenu items */}
                  {isOpen && item.children && expandedGroups[item.label] && (
                    <div className="ml-11 mt-1">
                      {item.children.map((child) => (
                        <a
                          key={child.label}
                          href={child.route}
                          className="block py-2 px-4 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                        >
                          {child.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

     
    </div>
  );
};

export default Sidebar;
