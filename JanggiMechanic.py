from JanggiBoard import JanggiBoard

class JanggiMechanic:
    """
    A class to update the Janggi game board. 
    Used by the JanggiGame class to move pieces on the board,
    and to initially place pieces on the board.
    """

    def __init__(self, board:JanggiBoard):
        "Initialize the mechanic with a JanggiBoard object."

        self._board = board

    def place_piece(self, piece):
        """
        Used to initially place a piece on the board. 
        Attempts to place the given piece at the given position.
        Returns False and changes nothing if there is already a piece at the position, 
        otherwise returns True and places the piece.
        """

        loc = piece.get_loc()

        # the second if also checks this condition
        if not self._board.loc_on_board(loc):
            return False

        if self._board.get_piece(loc) is not None:
            return False

        self._board.set_piece(piece, loc)
        return True

    def move_piece(self, piece, loc:str):
        """
        Moves the (piece) to the given location (loc).
        Returns the piece which was captured, or None 
        if no piece was captured.
        """

        # save the captured piece
        captured_piece = self._board.get_piece(loc)

        # clear the old location
        self._board.clear_loc(piece.get_loc())

        # move to new location
        self._board.set_piece(piece, loc)

        # update new location
        piece.set_pos(loc)

        return captured_piece
