# the Janggi Board
import sys

class JanggiBoard:
    """
    A class to represent the Janggi game board. The board is 
    designed to store information about which pieces are where 
    (via a dictionary). The board also contains methods which 
    report information about which pieces are where on the board.
    Each JanggiGame, Piece, and JanggiMechanic object has a 
    reference to a JanggiBoard object.
    """

    def __init__(self):
        """
        Initialize the board as a blank dictionary. Also initialize 
        dictionaries to convert from location notation (i.e. "b5") 
        to tuple notation, and a list of locations in the palace.
        """

        self._columns = {'a': 0, 'b': 1, 'c': 2, 'd': 3, 'e': 4, 'f': 5, 'g': 6, 'h': 7, 'i': 8}
        self._rev_columns = {val : key for key, val in self._columns.items()}
        self._rows = {'1': 0, '2': 1, '3': 2, '4': 3, '5': 4, '6': 5, '7': 6, '8': 7, '9': 8, '10': 9}
        self._rev_rows = {val : key for key, val in self._rows.items()}
        self._board = {column + row: None for column in self._columns for row in self._rows}
        self._palace = [col + str(row) for row in [1,2,3,8,9,10] for col in ['d', 'e', 'f']]
        self._saved_board = None

    def get_pieces(self):
        """
        Returns a list containing all pieces on the board.
        """

        return [piece for piece in self._board if piece is not None]

    def get_palace_pieces(self):
        """
        Returns a list containing all pieces in both palaces.
        """

        palace_spots = [self._board[i] for i in self._palace]
        palace_pieces = [piece for piece in palace_spots if piece is not None]

        return palace_pieces

    def save_board(self):
        """
        Saves the current state of the board. 
        Can be recovered with the recover_board method.
        Only one state is saved.
        """
        
        self._saved_board = dict(self._board)

    def recover_board(self):
        """
        Recovers the previous state of the board, as 
        stored in _saved_board. Updates the position of 
        each piece accordingly.
        """

        self._board = dict(self._saved_board)
        for loc in self._board:
            piece = self._board[loc]
            if piece is not None:
                piece.set_pos(loc)

    def loc_on_board(self, loc:str) -> bool:
        """
        Returns True if the location is on the board. Returns False 
        otherwise.
        """

        if loc in self._board:
            return True

        return False

    def tuple_on_board(self, tup:tuple) -> bool:
        """
        Returns True if the tuple is on the board. Returns False otherwise.
        """

        loc = self.tuple_to_loc(tup)

        return self.loc_on_board(loc)

    def loc_to_tuple(self, loc:str):
        """
        Converts the string location "b5", for example, to the position tuple 
        (1,4) (column, row). Returns None if the location is invalid.
        """

        if loc is None or len(loc) < 2:
            return None
        if loc[0] not in self._columns or loc[1:] not in self._rows:
            return None

        return (self._columns[loc[0]], self._rows[loc[1:]])

    def tuple_to_loc(self, tup:tuple):
        """
        Converts the tuple (1,4), for example, to the position 
        string "b5". If the tuple is not on the board, returns None.
        """

        if tup is None or len(tup) < 2:
            return None

        if tup[0] not in self._rev_columns:
            return None
        if tup[1] not in self._rev_rows:
            return None

        loc = self._rev_columns[tup[0]] + self._rev_rows[tup[1]]

        return loc

    def get_piece(self, loc:str):
        """
        Returns the piece at the given location (for 
        example "b5".) Returns None if there is no 
        piece at that location, or if the location is invalid.
        """

        if loc not in self._board:
            return None

        return self._board[loc]

    def clear_loc(self, loc:str):
        """
        Clears the location (loc) on the board (sets its value to None).
        Does nothing if (loc) is not on the board.
        """

        self.set_piece(None, loc)

    def set_piece(self, piece, loc:str):
        """
        Moves (piece) to (loc) on the board. Does nothing if loc 
        is not on the board. Does not check legality of the move.
        Does not clear the piece's old location.
        """

        if loc not in self._board:
            return None

        self._board[loc] = piece

    def get_player(self, loc:str):
        """
        Returns the player who owns the piece at the given location.
        Returns None if there is no piece there.
        """

        if loc is None:
            return None

        piece = self.get_piece(loc)

        if piece is None:
            return None

        return piece.get_player()

    def in_palace(self, loc:str) -> bool:
        """
        Returns True if the given location (for example "e3") 
        is in the palace. Returns False otherwise.
        """

        if loc in self._palace:
            return True
        return False

    def eprint(self, msg="", **kwargs):
        print(msg, file=sys.stderr, **kwargs)

    def print_piece(self, location:str):
        """
        Prints a piece on the board at the given location. 
        To be used with print_board.
        """
        num_spaces = 2

        # print "." when there is no piece in a position.
        # also, print a border around the palace
        space_type = {loc:" " for loc in self._board}
        pre_space_type = {loc:" " for loc in self._board}
        dot_type = {loc:"." for loc in self._board}
        palace_border_right_upper = ["d1", "e1", "d8", "e8"]
        palace_border_right_lower = ["d3", "e3", "d10", "e10"]
        palace_border_left_upper = ["e1", "f1", "e8", "f8"]
        palace_border_left_lower = ["e3", "f3", "e10", "f10"]
        palace_border_vert = ["d2", "d3", "d9", "d10", "f2", "f3", "f9", "f10"]
        for border_piece in palace_border_right_upper:
            space_type[border_piece] = "-"
        for border_piece in palace_border_right_lower:
            space_type[border_piece] = "_"
        for border_piece in palace_border_left_upper:
            pre_space_type[border_piece] = "-"
        for border_piece in palace_border_left_lower:
            pre_space_type[border_piece] = "_"
        for border_piece in palace_border_vert:
            dot_type[border_piece] = "!"

        # define the display components for the location
        piece = self._board[location]
        space = space_type[location]
        pre_space = pre_space_type[location]
        dot = dot_type[location]

        # print the location
        if piece is None:
            self.eprint(pre_space + dot + space * num_spaces, end="")
            return
        name = piece.get_name()
        if len(name) == 3:
            self.eprint(name + space * (num_spaces - 1), end="")
            return
        self.eprint(pre_space + name + space * (num_spaces - 1), end="")

    def print_board(self):
        "Prints a representation of the board."

        self.eprint("     ", end="")
        for col in self._columns:
            self.eprint(col + "   ", end="")
        self.eprint()
        self.eprint("   ------------------------------------")
        for row in self._rows:
            self.eprint(row + " | " if int(row) < 10 else row + "| ", end="")
            for col in self._columns:
                self.print_piece(col + row)
            self.eprint()
