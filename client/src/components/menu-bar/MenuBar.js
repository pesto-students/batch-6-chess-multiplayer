import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Avatar from '@material-ui/core/Avatar';
import { ListItem, ListItemText } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import auth from '../../auth/auth';
import config from '../../config/globalConfig';

export default class MenuBar extends Component {
  state = {
    loggedIn: false,
    user: {},
    anchorEl: null,
  };

  componentDidMount() {
    this.fetchUserDetails();
  }

  componentDidUpdate() {
    this.fetchUserDetails();
  }

  fetchUserDetails = () => {
    const { loggedIn } = this.state;
    if (!loggedIn && auth.isAuthenticated()) {
      auth.fetchUserData()
        .then((user = {}) => {
          this.setState({ loggedIn: true, user });
        })
        .catch(() => {
          this.setState({ loggedIn: false, user: {} });
        });
    }
  }

  handleMenu = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  }

  handleClose = () => {
    this.setState({ anchorEl: null });
  }

  handleLogout = () => {
    const { history } = this.props;
    this.handleClose();
    auth.logout(() => {
      this.setState({ loggedIn: false, user: {} });
      history.push(config.loginRoute);
    });
  }

  renderUserAvatar = (picture) => {
    if (picture === '') {
      return <AccountCircle />;
    }
    return <Avatar src={picture} style={{ margin: '0 auto' }} />;
  }

  renderLinkMenuItem = (routePath, linkName) => (
    <MenuItem onClick={this.handleClose}>
      <Link to={routePath} style={{ textDecoration: 'none', color: 'inherit' }}>{linkName}</Link>
    </MenuItem>
  )

  render() {
    const { loggedIn, user, anchorEl } = this.state;
    const open = Boolean(anchorEl);
    const { picture = '', name, rating } = user;
    return (
      <div style={{ flexGrow: '1', marginBottom: '10px' }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" color="inherit" style={{ flexGrow: '1', marginLeft: '10px' }}>
                Online Chess
            </Typography>
            {loggedIn && (
              <div>
                <IconButton
                  aria-owns={open ? 'menu-appbar' : undefined}
                  aria-haspopup="true"
                  onClick={this.handleMenu}
                  color="inherit"
                >
                  { this.renderUserAvatar(picture) }
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={this.handleClose}
                  disableAutoFocusItem
                  autoFocus={false}
                >
                  <ListItem component="span">{this.renderUserAvatar(picture)}</ListItem>
                  <ListItem style={{ textTransform: 'capitalize' }}>
                    <ListItemText primary={name} secondary={rating} />
                  </ListItem>
                  <Divider variant="middle" />
                  {this.renderLinkMenuItem(config.dashboardRoute, 'Dashboard')}
                  {this.renderLinkMenuItem(config.leaderboardRoute, 'Leaderboard')}
                  <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
                </Menu>
              </div>
            )}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

MenuBar.propTypes = {
  history: PropTypes.object.isRequired,
};
