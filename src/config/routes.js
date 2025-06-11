import BrowsePage from '@/components/pages/BrowsePage';
import MySkillsPage from '@/components/pages/MySkillsPage';
import MessagesPage from '@/components/pages/MessagesPage';
import CalendarPage from '@/components/pages/CalendarPage';
import ProfilePage from '@/components/pages/ProfilePage';
import HomePage from '@/components/pages/HomePage'; // Added HomePage as it wasn't in original routes but was a page

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Home',
    component: HomePage
  },
  browse: {
    id: 'browse',
    label: 'Browse',
    path: '/browse',
    icon: 'Search',
    component: BrowsePage
  },
  mySkills: {
    id: 'mySkills',
    label: 'My Skills',
    path: '/my-skills',
    icon: 'BookOpen',
    component: MySkillsPage
  },
  messages: {
    id: 'messages',
    label: 'Messages',
    path: '/messages',
    icon: 'MessageCircle',
    component: MessagesPage
  },
  calendar: {
    id: 'calendar',
    label: 'Calendar',
    path: '/calendar',
    icon: 'Calendar',
    component: CalendarPage
  },
  profile: {
    id: 'profile',
    label: 'Profile',
    path: '/profile',
    icon: 'User',
    component: ProfilePage
  }
};

export const routeArray = Object.values(routes);