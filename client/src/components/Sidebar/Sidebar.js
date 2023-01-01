import onlineIcon from '../../assets/img/onlineIcon.png';

import './Sidebar.css';

const Sidebar = (props) => {
  let sidebarClasses = 'sidebar sidebar__hide';
  if (props.sidebarShow) {
    sidebarClasses = 'sidebar';
  }

  return (
    <div className={sidebarClasses}>
      <div className='sidebar__room'>
        <h2>Room ID : {props.room}</h2>
      </div>
      <div className='sidebar__active_container'>
        <h3 className='underln'>Users Online</h3>
        <ul className='sidebar__active_list'>
          {props.users[0]
            ? props.users.map((item, index) => (
                <li className='sidebar__active_item' key={index}>
                  {item.name}
                </li>
              ))
            : null}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
