import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import './MoveHistory.css';

const styles = () => ({
  tableBody: {
    overflowX: 'hidden',
    overflowY: 'scroll',
    maxHeight: '50vh',
  },
});

const MoveHistory = ({ moves, classes }) => {
  const movePairs = moves.reduce((acc, elm) => {
    const currentPair = acc[acc.length - 1];
    if (!currentPair || currentPair.length === 2) {
      const newPair = [elm];
      return [...acc, newPair];
    }
    currentPair.push(elm);
    return acc;
  }, []);
  const movesDisp = movePairs.map((movePair, index) => (
    <TableRow key={`${index + 1}${movePair[0].san}`}>
      <TableCell component="th" scope="row">{index + 1}</TableCell>
      <TableCell>{movePair[0].san }</TableCell>
      <TableCell>{movePair[1] ? <span className="black-move">{movePair[1].san}</span> : null }</TableCell>
    </TableRow>
  ));
  return (
    <div className="move-history">
      <Table className={classes.tableBody}>
        <TableBody>
          {movesDisp}
        </TableBody>
      </Table>
    </div>
  );
};

MoveHistory.propTypes = {
  moves: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired,

};

export default withStyles(styles)(MoveHistory);
