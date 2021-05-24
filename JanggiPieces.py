# pieces for the Janggi game

from JanggiBoard import JanggiBoard
from JanggiPosition import JanggiPosition
from JanggiMechanic import JanggiMechanic

class Piece:
    """
    A class to represent a generic Janggi Piece. The generic Janggi 
    Piece has attributes for its current position (a JanggiPosition object), 
    name, and the JanggiBoard it belongs to. The JanggiBoard _board dictionary
    contains the locations of each Piece as well.

    Methods for the generic Janggi Piece are for reporting information about 
    the Piece (i.e. name, owner of the piece), or for helping the Pieces themselves
    calculate potential moves.
    """

    def __init__(self, player:str, number:int, character:str, location:dict, board:JanggiBoard):
        """
        Place the piece on the board, and keep track of this piece's location. 

        Each child class of Piece will give the superclass a location dictionary 
        which contains information about where to initially place the piece.
        """

        # construct the piece's name
        if character == "G":
            self._name = player + character
        else:
            self._name = player + character + str(number)

        # get the piece's starting location
        if player in location and number in location[player]:
            self._pos = JanggiPosition(location[player][number], board)
        else:
            self._pos = JanggiPosition("invalid location", board)

        # place the piece on the board
        self._board = board
        mechanic = JanggiMechanic(self._board)
        mechanic.place_piece(self)

    def get_name(self) -> str:
        "Returns the piece's name."

        return self._name

    def get_player(self) -> str:
        "Returns the player that owns this piece."

        return self._name[0]
    
    def get_pos(self) -> JanggiPosition:
        "Returns the piece's current position."

        return self._pos

    def get_loc(self) -> str:
        "Returns the piece's current location string."

        return self._pos.get_loc()
    
    def set_pos(self, loc:str):
        "Sets the current position of the piece."

        pos = JanggiPosition(loc, self._board)

        self._pos = pos

    def pos_on_board(self, pos:JanggiPosition) -> bool:
        """
        Returns True if the position pos is on the board. 
        Returns False otherwise. 
        """

        return self._board.loc_on_board(pos.get_loc())

    def get_pos_player(self, pos:JanggiPosition):
        """
        If there is a piece at the given position, returns
        the player who owns that piece. If there is no piece 
        at the position or the position is invalid, returns None.
        """

        return self._board.get_player(pos.get_loc())

    def loc_from_pos(self, pos):
        """
        Takes either a JanggiPosition object or a location string (i.e. "b5")
        as input. If given a JanggiPosition object, loc_from_pos converts it 
        to a location string, and returns that string. If given a location 
        string, loc_from_pos returns that string. Does not check if the 
        location or position is on the board.
        """

        if type(pos) == JanggiPosition:
            return pos.get_loc()
        return pos

    def is_open(self, pos):
        """
        Takes either a JanggiPosition object or a location string (i.e. "b5")
        as input. Returns True if the position is valid and doesn't contain a piece.
        Returns False otherwise. 
        """

        # convert the location/position to a location string
        loc = self.loc_from_pos(pos)

        if not self._board.loc_on_board(loc):
            return False

        return self._board.get_piece(loc) is None

    def is_us(self, pos):
        """
        Takes either a JanggiPosition object or a location string (i.e. "b5") 
        as input. Returns True if the position contains a piece owned by 
        the current player. Returns False otherwise. 
        """

        # convert the location/position to a location string
        loc = self.loc_from_pos(pos)

        return self._board.get_player(loc) == self.get_player()

    def is_not_us(self, pos):
        """
        Takes either a JanggiPosition object or a location string (i.e. "b5") 
        as input. Returns True if the position does not contain a piece owned by 
        the current player. Returns False otherwise. 
        """

        # convert the location/position to a location string
        loc = self.loc_from_pos(pos)

        return self._board.get_player(loc) != self.get_player()

    def is_opponent(self, pos):
        """
        Takes either a JanggiPosition object or a location string (i.e. "b5") 
        as input. Returns True if the position contains a piece owned by 
        the opposite player. Returns False otherwise. 
        """

        return self.is_not_us(pos) and (not self.is_open(pos))

    def is_piece(self, pos):
        """
        Takes either a JanggiPosition object or a location string (i.e. "b5")
        as input. Returns True if the position contains a piece owned by 
        either player. Returns False otherwise. 
        """

        return self.is_us(pos) or self.is_opponent(pos)

    def ok_to_move_here(self, pos):
        """
        Takes either a JanggiPosition object or a location string (i.e. "b5") 
        as input. Returns True if the position is on the board and 
        does not contain a piece owned by the current player. 
        Returns False otherwise. 
        """

        if type(pos) == str:
            pos = JanggiPosition(pos, self._board)

        return self.pos_on_board(pos) and self.is_not_us(pos)

class Elephant(Piece):
    """
    A class to represent the Elephant piece.
    """

    def __init__(self, player, number, board):
        "Initialize the elephant."

        location = {"R": {1: "b1", 2: "g1"}, "B": {1: "b10", 2: "g10"}}

        self._movement = {
            (0,1): [(1,1), (-1,1)], 
            (0,-1): [(1,-1), (-1,-1)], 
            (1,0): [(1,1), (1,-1)],
            (-1,0): [(-1,1), (-1,-1)]
        }

        super().__init__(player, number, "E", location, board)

    def get_moves(self) -> list:
        "Returns a list of valid moves for this Elephant."

        valid_moves = []

        # try the first move in each direction
        for first_move in self._movement:
            first_pos = self._pos.shift(first_move)
            # if the first position is open, check the next moves
            if self.is_open(first_pos):
                # there are two options for second move: diagonal right or diagonal left
                for second_move in self._movement[first_move]:
                    second_pos = first_pos.shift(second_move)
                    # if the second position is open, repeat the second move
                    if self.is_open(second_pos):
                        third_pos = second_pos.shift(second_move)
                        # add the move if it is valid
                        if self.ok_to_move_here(third_pos):
                            valid_moves.append(third_pos.get_loc())

        return valid_moves

class General(Piece):
    " A class to represent the General piece."

    def __init__(self, player, board):
        "Initialize the general."

        location = {"R": {1: "e2"}, "B": {1: "e9"}}

        self._moves = {
            "d8": ["e8", "d9", "e9"],
            "e8": ["d8", "f8", "e9"],
            "f8": ["e8", "e9", "f9"],
            "d9": ["d8", "e9", "d10"],
            "e9": ["d8", "e8", "f8", "d9", "f9", "d10", "e10", "f10"],
            "f9": ["f8", "e9", "f10"],
            "d10": ["d9", "e9", "e10"],
            "e10": ["e9", "d10", "f10"],
            "f10": ["e9", "f9", "e10"],
            "d3": ["e3", "d2", "e2"],
            "e3": ["d3", "f3", "e2"],
            "f3": ["e3", "e2", "f2"],
            "d2": ["d3", "e2", "d1"],
            "e2": ["d3", "e3", "f3", "d2", "f2", "d1", "e1", "f1"],
            "f2": ["f3", "e2", "f1"],
            "d1": ["d2", "e2", "e1"],
            "e1": ["e2", "d1", "f1"],
            "f1": ["e2", "f2", "e1"],
        }

        super().__init__(player, 1, "G", location, board)

    def get_moves(self):
        "Returns a list of valid moves for the General."

        valid_moves = []

        if self.get_loc() in self._moves:
            for move in self._moves[self.get_loc()]:
                # add the move if valid
                if self.ok_to_move_here(move):
                    valid_moves.append(move)
        
        return valid_moves

class Advisor(Piece):
    "A class to represent the Advisor piece."

    def __init__(self, player, number, board):
        "Initialize the advisor."

        location = {"R": {1: "d1", 2: "f1"}, "B": {1: "d10", 2: "f10"}}

        self._moves = {
            "d8": ["e8", "d9", "e9"],
            "e8": ["d8", "f8", "e9"],
            "f8": ["e8", "e9", "f9"],
            "d9": ["d8", "e9", "d10"],
            "e9": ["d8", "e8", "f8", "d9", "f9", "d10", "e10", "f10"],
            "f9": ["f8", "e9", "f10"],
            "d10": ["d9", "e9", "e10"],
            "e10": ["e9", "d10", "f10"],
            "f10": ["e9", "f9", "e10"],
            "d3": ["e3", "d2", "e2"],
            "e3": ["d3", "f3", "e2"],
            "f3": ["e3", "e2", "f2"],
            "d2": ["d3", "e2", "d1"],
            "e2": ["d3", "e3", "f3", "d2", "f2", "d1", "e1", "f1"],
            "f2": ["f3", "e2", "f1"],
            "d1": ["d2", "e2", "e1"],
            "e1": ["e2", "d1", "f1"],
            "f1": ["e2", "f2", "e1"],
        }

        super().__init__(player, number, "A", location, board)

    def get_moves(self):
        "Returns a list of valid moves for the Advisor."

        valid_moves = []

        if self.get_loc() in self._moves:
            for move in self._moves[self.get_loc()]:
                # add the move if valid
                if self.ok_to_move_here(move):
                    valid_moves.append(move)
        
        return valid_moves

class Chariot(Piece):
    "A class to represent a Chariot piece."

    def __init__(self, player, number, board):
        "Initialize the Chariot."

        location = {"R": {1: "a1", 2: "i1"}, "B": {1: "a10", 2: "i10"}}

        # movement direction vectors
        self._directions = [(1,0), (-1,0), (0,1), (0,-1)]

        # palace movement dictionary
        # format: 
        # start: (jump, dest)
        self._palace_corner_moves = {
            "d1": ("e2", "f3"),
            "f1": ("e2", "d3"),
            "d3": ("e2", "f1"),
            "f3": ("e2", "d1"),
            "d10": ("e9", "f8"),
            "f10": ("e9", "d8"),
            "d8": ("e9", "f10"),
            "f8": ("e9", "d10")
        }

        self._palace_center_moves = {
            "e2": ["d3", "f3", "d1", "f1"],
            "e9": ["d8", "f8", "d10", "f10"]
        }

        super().__init__(player, number, "C", location, board)

    def get_step(self, start:JanggiPosition, direction:tuple) -> JanggiPosition:
        """
        Generator function that finds the next position
        on the board in the given direction. Starts at the 
        start position. Returns the next position 
        while the next position is on the board.
        """

        step = start.shift(direction)

        while self.pos_on_board(step):
            yield step
            step = step.shift(direction)

    def get_move(self, direction:tuple) -> str:
        """
        Generator function that finds the next valid move 
        in the given direction. 
        """

        start = self._pos

        for step in self.get_step(start, direction):
            # if we reach our own piece, stop here
            if self.is_us(step):
                return

            # if we reach the opponents piece, return the location
            # then stop here
            if self.is_opponent(step):
                yield step.get_loc()
                return

            yield step.get_loc()

    def get_moves(self) -> list:
        "Returns a list of valid moves for this Cannon."

        valid_moves = []

        for direction in self._directions:
            for move in self.get_move(direction):
                valid_moves.append(move)

        # add diagonal moves if appropriate
        if self.get_loc() in self._palace_corner_moves:
            move1, move2 = self._palace_corner_moves[self.get_loc()]
            if self.ok_to_move_here(move1):
                valid_moves.append(move1)
            if self.is_open(move1) and self.ok_to_move_here(move2):
                valid_moves.append(move2)
        
        # add moves from center of palace if appropriate
        if self.get_loc() in self._palace_center_moves:
            moves = self._palace_center_moves[self.get_loc()]
            for move in moves:
                if self.ok_to_move_here(move):
                    valid_moves.append(move)

        return valid_moves

class Cannon(Piece):
    "A class to represent the Cannon piece."

    def __init__(self, player, number, board):
        "Initialize the Cannon."

        location = {"R": {1: "b3", 2: "h3"}, "B": {1: "b8", 2: "h8"}}

        # movement direction vectors
        self._directions = [(1,0), (-1,0), (0,1), (0,-1)]

        # palace movement dictionary
        # format: 
        # start: (jump, dest)
        self._palace_moves = {
            "d1": ("e2", "f3"),
            "f1": ("e2", "d3"),
            "d3": ("e2", "f1"),
            "f3": ("e2", "d1"),
            "d10": ("e9", "f8"),
            "f10": ("e9", "d8"),
            "d8": ("e9", "f10"),
            "f8": ("e9", "d10")
        }

        super().__init__(player, number, "O", location, board)

    def is_cannon(self, pos:JanggiPosition) -> bool:
        """
        Returns True if there is a Cannon at the given 
        position. Returns False otherwise.
        """
        
        piece = self._board.get_piece(pos.get_loc())

        if piece is None:
            return False

        if piece.get_name()[1] == 'O':
            return True
        
        return False

    def get_step(self, start:JanggiPosition, direction:tuple) -> JanggiPosition:
        """
        Generator function that finds the next position
        on the board in the given direction. Starts at the 
        start position. Returns the next position 
        while the next position is on the board.
        """

        step = start.shift(direction)

        while self.pos_on_board(step):
            yield step
            step = step.shift(direction)

    def get_jump_pos(self, direction:tuple):
        """
        Returns the position of the next piece in the given direction 
        (starting at the Cannon's current position). This is the position
        the Cannon will jump over.
        Returns False if no piece is found.
        """

        for step in self.get_step(self._pos, direction):
            # if there is a cannon here, stop
            if self.is_cannon(step):
                return False

            # if we find a non-cannon piece, return the position
            if self.is_piece(step):
                return step
        # no pieces found
        return False

    def get_move(self, direction:tuple) -> str:
        """
        Generator function that finds the next valid move 
        in the given direction. 
        """

        start = self.get_jump_pos(direction)

        # if there is no jump position, do nothing
        if not start:
            return

        for step in self.get_step(start, direction):
            # if we reach a cannon, stop here
            if self.is_cannon(step):
                return

            # if we reach our own piece, stop here
            if self.is_us(step):
                return

            # if we reach the opponents piece, return the location
            # then stop here
            if self.is_opponent(step):
                yield step.get_loc()
                return

            yield step.get_loc()

    def get_moves(self) -> list:
        "Returns a list of valid moves for this Cannon."

        valid_moves = []

        for direction in self._directions:
            for move in self.get_move(direction):
                valid_moves.append(move)

        # add diagonal moves if appropriate
        if self.get_loc() in self._palace_moves:
            jump, dest = self._palace_moves[self.get_loc()]
            if self.is_piece(jump) and self.ok_to_move_here(dest):
                valid_moves.append(dest)

        return valid_moves

class Horse(Piece):
    "A class to represent the Horse piece."

    def __init__(self, player, number, board):
        "Initialize the horse."

        location = {"R": {1: "c1", 2: "h1"}, "B": {1: "c10", 2: "h10"}}

        self._movement = {
            (0,1): [(1,1), (-1,1)], 
            (0,-1): [(1,-1), (-1,-1)], 
            (1,0): [(1,1), (1,-1)],
            (-1,0): [(-1,1), (-1,-1)]
        }

        super().__init__(player, number, "H", location, board)

    def get_moves(self) -> list:
        "Returns a list of valid moves for this Horse"

        valid_moves = []

        # try moving in each direction
        for first_move in self._movement:
            first_pos = self._pos.shift(first_move)
            # if the first move is clear, move on to second move
            if self.is_open(first_pos):
                # there are two possible second moves: diagonal right or diagonal left
                for second_move in self._movement[first_move]:
                    second_pos = first_pos.shift(second_move)
                    # add the move if it is valid
                    if self.ok_to_move_here(second_pos):
                        valid_moves.append(second_pos.get_loc())

        return valid_moves

class Soldier(Piece):
    "A class to represent the Soldier piece."

    def __init__(self, player, number, board):
        "Initialize the soldier."

        location = {
            "R": {1: "a4", 2: "c4", 3: "e4", 4: "g4", 5: "i4"},
            "B": {1: "a7", 2: "c7", 3: "e7", 4: "g7", 5: "i7"}
        }

        if player == "R":
            direction = 1
        else:
            direction = -1

        # normal movement
        self._movement = [(1, 0), (-1, 0), (0, direction)]

        # extra moves when in the palace
        self._palace_moves = {
            "d8": ["e9"],
            "f8": ["e9"],
            "e9": ["d10", "f10"],
            "d3": ["e2"],
            "f3": ["e2"],
            "e2": ["d1", "f1"]
        }

        super().__init__(player, number, "S", location, board)

    def get_moves(self):
        "Returns a list of valid moves for this Soldier."

        valid_moves = []

        for movement in self._movement:
            move = self._pos.shift(movement)
            # add the move if valid
            if self.ok_to_move_here(move):
                valid_moves.append(move.get_loc())

        if self.get_loc() in self._palace_moves:
            for palace_move in self._palace_moves[self.get_loc()]:
                # add the move if valid
                if self.ok_to_move_here(palace_move):
                    valid_moves.append(palace_move)

        return valid_moves
