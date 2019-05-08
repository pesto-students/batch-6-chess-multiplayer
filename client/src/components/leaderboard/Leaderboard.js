/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import API from '../../apis/chessGameApi';
import './Leaderboard.css';

export default class Leaderboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
    };
  }

  componentDidMount() {
    API.getLeaderboard()
      .then((response) => {
        const { leaderboard = [] } = response;
        this.setState({ users: leaderboard });
      });
  }

  renderTableBody = users => (
    <TableBody>
      { users.map(user => (
        <TableRow key={user._id}>
          <TableCell>
            <Avatar src={user.picture} />
          </TableCell>
          <TableCell>
            {user.name}
          </TableCell>
          <TableCell align="right">
            {user.rating}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );

  render() {
    const { users } = this.state;
    return (
      <div id="leaderboard-container">
        <Typography variant="h3" gutterBottom align="center">
          Leaderboard
        </Typography>
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Name</TableCell>
                <TableCell align="right">Rating</TableCell>
              </TableRow>
            </TableHead>
            { this.renderTableBody(users) }
          </Table>
        </Paper>
      </div>
    );
  }
}
