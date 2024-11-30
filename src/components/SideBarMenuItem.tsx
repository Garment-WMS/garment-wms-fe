import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MenuProps } from '@/constants/interface';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SideBarMenuItemProps {
  menu: MenuProps;
  open: boolean;
  activeTitle: string;
  handleMenuClick: (title: string) => void;
}

const SideBarMenuItem: React.FC<SideBarMenuItemProps> = ({ menu, open, activeTitle, handleMenuClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => setIsOpen(!isOpen);

  if (menu.isGroup && menu.children) {
    return (
      <li>
        <motion.div
          className={`flex font-semibold rounded-md p-2 cursor-pointer hover:bg-blue-500 text-sm items-center gap-x-4 mt-2
          hover:text-white ${activeTitle === menu.title ? 'text-bluePrimary-foreground bg-blue-100' : 'text-white'}
          ${!open && 'justify-center'}`}
          onClick={toggleOpen}
          whileTap={{ scale: 0.95 }}
        >
          {menu.renderIcon}
          {open && (
            <>
              <span className="flex-1">{menu.title}</span>
              <motion.div
                initial={false}
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={16} />
              </motion.div>
            </>
          )}
        </motion.div>
        <AnimatePresence initial={false}>
          {isOpen && open && (
            <motion.ul
              initial="collapsed"
              animate="open"
              exit="collapsed"
              variants={{
                open: { opacity: 1, height: 'auto' },
                collapsed: { opacity: 0, height: 0 }
              }}
              transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
              className="pl-4 overflow-hidden"
            >
              {menu.children.map((childMenu, childIndex) => (
                <SideBarMenuItem
                  key={childIndex}
                  menu={childMenu}
                  open={open}
                  activeTitle={activeTitle}
                  handleMenuClick={handleMenuClick}
                />
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </li>
    );
  }

  return (
    <li>
      <Link to={menu.link || '#'}>
        <div
          className={`flex font-semibold rounded-md p-2 cursor-pointer hover:bg-blue-500 text-sm items-center gap-x-4 mt-2
          hover:text-white ${activeTitle === menu.title ? 'text-bluePrimary-foreground bg-blue-100' : 'text-white'}
          ${!open && 'justify-center'}`}
          onClick={() => handleMenuClick(menu.title)}
        >
          {menu.renderIcon}
          {open && <span>{menu.title}</span>}
        </div>
      </Link>
    </li>
  );
};

export default SideBarMenuItem;

