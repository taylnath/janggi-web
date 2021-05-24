from JanggiBoard import JanggiBoard

class JanggiPosition:
    """
    A class to represent a position on the Janggi game board. 
    A JanggiPosition can be initialized using a location string ("b5") 
    or a tuple ((1,4)). The purpose of this class is to have clean 
    syntax for adding vectors (represented by tuples) to positions on the 
    board (represented usually as location strings). The most important 
    method is the shift method, which does this vector addition.

    The JanggiPosition class uses the JanggiBoard class to do conversions 
    between tuple and location string, and to check whether a given tuple 
    is actually on the board. 

    The Pieces store their location information as a JanggiPosition, 
    so that they can use the shift method to calculate potential moves. 
    """

    def __init__(self, pos, board:JanggiBoard):
        """
        Initialize the position, setting _loc to be the 
        current location string, and setting _tuple to be the 
        current location tuple. pos can be either a tuple or a 
        location string. If the position is not 
        on the board, both _loc and _tuple are set to None.
        """

        self._board = board
        self.set_pos(pos)

    def __repr__(self):
        "Return the position's location string."

        return self._loc

    def set_pos(self, pos):
        """
        Set the position. pos can be either a tuple or a 
        location string. If the position is not 
        on the board, both _loc and _tuple are set to None.
        """

        if type(pos) == str and self._board.loc_on_board(pos):
            self._loc = pos
            self._tuple = self._board.loc_to_tuple(pos)
        elif type(pos) == tuple and self._board.tuple_on_board(pos):
            self._loc = self._board.tuple_to_loc(pos)
            self._tuple = pos
        else:
            self._loc = None
            self._tuple = None


    # def tuple_to_loc(self, tup:tuple):
    #     """
    #     Convert the tuple to a location on the board.
    #     Returns None if the location is not valid.
    #     """

    #     return self._board.tuple_to_loc(tup)

    # def loc_to_tuple(self, loc:str):
    #     """
    #     Converts the location string to a tuple on the board.
    #     Returns None if the location is not valid.
    #     """

    #     return self._board.loc_to_tuple(loc)

    def get_tuple(self) -> tuple:
        "Returns the position's tuple representation."

        return self._tuple

    def get_loc(self) -> str:
        "Returns the position's location string representation."

        return self._loc

    def add_tuples(self, tup1:tuple, tup2:tuple) -> tuple:
        """
        Performs vector addition on the two tuples, and 
        returns the sum.
        For example, (1,2) + (0,1) = (1,3).
        """

        if tup1 is None or tup2 is None:
            return None

        return (tup1[0] + tup2[0], tup1[1] + tup2[1])


    def shift(self, movement:tuple):
        """
        Shifts the position by the movement tuple (using vector 
        addition). Returns a new JanggiPosition with the shifted coordinates.
        """

        new_tuple = self.add_tuples(self._tuple, movement)
        new_pos = JanggiPosition(new_tuple, self._board)

        return new_pos
