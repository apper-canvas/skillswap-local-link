import Browse from '../pages/Browse';
import MySkills from '../pages/MySkills';
import Messages from '../pages/Messages';
import Calendar from '../pages/Calendar';
import Profile from '../pages/Profile';
import NotFound from '../pages/NotFound';

export const routes = {
  browse: {
    id: 'browse',
    label: 'Browse',
    path: '/',
    icon: 'Search',
    component: Browse
  },
  mySkills: {
    id: 'mySkills',
    label: 'My Skills',
    path: '/my-skills',
    icon: 'BookOpen',
    component: MySkills
  },
  messages: {
    id: 'messages',
    label: 'Messages',
    path: '/messages',
    icon: 'MessageCircle',
    component: Messages
  },
  calendar: {
    id: 'calendar',
    label: 'Calendar',
    path: '/calendar',
    icon: 'Calendar',
    component: Calendar
  },
  profile: {
    id: 'profile',
    label: 'Profile',
    path: '/profile',
    icon: 'User',
    component: Profile
  }
};

export const routeArray = Object.values(routes);