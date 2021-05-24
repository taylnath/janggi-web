# Author: Nathan Taylor
# Date: 2/19/2021
# Description: A Python implementation of Janggi.
from JanggiPieces import Elephant, Advisor, Chariot, Cannon, Horse, General, Soldier
from JanggiBoard import JanggiBoard
from JanggiMechanic import JanggiMechanic

class JanggiGame:
    "A class to represent the Janggi game."

    def __init__(self):
        """
        Initialize the game with a populated board, starting 
        player "B"lue, and starting _state "UNFINISHED".
        """

        self._board = JanggiBoard()
        self._player = "B"
        self._mechanic = JanggiMechanic(self._board)
        self._state = "UNFINISHED"
        self._pieces = {"R": [], "B": []}
        self._in_check = {"R": "", "B": ""}

        # place pieces on the board
        for player in ["R", "B"]:
            general = General(player, self._board)
            self._pieces[player].append(general)
            for number in [1, 2]:
                for piece_type in [Elephant, Advisor, Chariot, Cannon, Horse]:
                    piece = piece_type(player, number, self._board)
                    self._pieces[player].append(piece)
            for number in [1,2,3,4,5]:
                soldier = Soldier(player, number, self._board)
                self._pieces[player].append(soldier)

    def get_player(self) -> str:
        "Returns the current player."

        return self._player

    def get_in_check(self, player:str) -> str:
        "Returns the string 'Yes' if the player is in check."

        return self._in_check[player]

    def get_game_state(self) -> str:
        """
        Returns 'UNFINISHED', 'RED_WON', or 'BLUE_WON', 
        depending on the state of the game.
        """

        return self._state

    def get_general(self, player:str) -> General:
        """
        Returns the general belonging to the given player.
        """

        return self._pieces[player][0]

        # for piece in self._board.get_palace_pieces():
        #     if type(piece) == General and piece.get_player() == player:
        #         return piece

    # the exclude excludes the piece that was optionally captured
    def is_in_check(self, player:str, exclude=None) -> bool:
        """
        Returns True if the player is in check. 
        Returns False otherwise. Only looks at the 
        first letter of the given string (player) to identify the player 
        (i.e. "B", "b", and "Blue" are all interpreted as the blue player.)

        The optional exclude parameter is for a piece that was captured when 
        trying out a move. If this parameter is passed, the given piece will 
        be ignored. The try_move method does not remove the captured 
        piece, in case the move will put the player's general in check.
        """

        player = player[0].upper()

        general_loc = self.get_general(player).get_loc()

        opponent = self.get_opponent(player)

        opponent_pieces = [piece for piece in self._pieces[opponent] if piece is not exclude]

        # for piece in self._pieces[opponent]:
        for piece in opponent_pieces:
            if general_loc in piece.get_moves():
                return True

        return False

    def get_opponent(self, player:str) -> str:
        """
        Returns the player opposing the given player.
        I.e. returns "R" if the given player is "B".
        """

        if player == 'B':
            return 'R'
        else:
            return 'B'

    def update_turn(self):
        """
        Changes the current turn from 'B' to 'R' or 
        from 'R' to 'B'. (should this be called brb?)
        """

        self._player = self.get_opponent(self._player)

    def get_board(self) -> JanggiBoard:
        """
        Returns the game board.
        """

        return self._board

    def try_move(self, piece, move_to):
        """
        Saves the board, then makes the given move (if valid).
        If the move puts the current player in check, try_move 
        restores the board and returns False.
        """

        self._board.save_board()
        captured_piece = self._mechanic.move_piece(piece, move_to)
        if self.is_in_check(self._player, exclude=captured_piece):
            self._board.recover_board()
            return False
        return True

    def check_if_player_won(self, player:str) -> bool:
        """
        Checks if the opponent to the given player is in check and 
        has no moves to get out of check.
        """

        opponent = self.get_opponent(player)

        if not self.is_in_check(opponent):
            return False

        for piece in self._pieces[opponent]:
            for move in piece.get_moves():
                # old_loc = piece.get_loc() # debug
                self._board.save_board()
                self._mechanic.move_piece(piece, move)
                if not self.is_in_check(opponent):
                    # print("check win: found move " + old_loc + " to " + move) # debug
                    self._board.recover_board()
                    return False
                self._board.recover_board()

        return True

    def declare_winner(self, player:str):
        """
        Declares the (player) to be the winner.
        """

        if player == "R":
            self._state = "RED_WON"
        elif player == "B":
            self._state = "BLUE_WON"

    def make_move(self, move_from, move_to):
        """
        Attempts to move a piece located at move_from location to 
        the move_to location.
        """

        # check the game state
        if self._state != 'UNFINISHED':
            return False

        # get the pieces at the move_from and move_to locations
        piece = self._board.get_piece(move_from)
        to_piece = self._board.get_piece(move_to)

        # return False if there is no piece at move_from
        if piece is None:
            return False

        # if the piece is not owned by the current player, return False
        if piece.get_player() != self._player:
            return False

        # # if the destination piece is owned by the current player, return False
        # if to_piece is not None and to_piece.get_player() == self._player:
        #     return False

        # if the current player wants to skip a turn, 
        # update the turn and do nothing else
        if move_to == move_from:
            if self.is_in_check(self._player):
                return False
            self.update_turn()
            return True

        # if the piece cannot move to the given location, return False
        if move_to not in piece.get_moves():
            return False

        # make the move, then undo if it puts the current player in check
        if not self.try_move(piece, move_to):
            return False

        # if a piece was captured, remove it from the opponent's piece list
        opponent = self.get_opponent(self._player)
        if to_piece in self._pieces[opponent]:
            self._pieces[opponent].remove(to_piece)

        # check if the current player won
        if self.check_if_player_won(self._player):
            self.declare_winner(self._player)

        # update whether each player is in check or not
        for player in [self._player, opponent]:
            if self.is_in_check(player):
                self._in_check[player] = "Yes"
            else:
                self._in_check[player] = "No"

        self.update_turn()
        
        return True

if __name__ == "__main__":
    def mm(game, from_loc, to_loc):
        print(game.make_move(from_loc, to_loc))
        game.get_board().print_board()

    g = JanggiGame()
    g.get_board().print_board()

    mm(g, "b10", "d7")
    mm(g, "d1", "e1")
    mm(g, "d7", "f4")
    mm(g, "h1", "g3")
    mm(g, "f4", "f4")
    mm(g, "e2", "d2")
    mm(g, "f4", "f4")
    mm(g, "g3", "e2")
    mm(g, "f4", "f4")
    mm(g, "d2", "d1")
    mm(g, "f4", "f4")
    mm(g, "e2", "f4")
    # mm(g, "e7", "e6")
    # mm(g, "e4", "e5")
    # mm(g, "e6", "e5")
    # mm(g, "e2", "e3")
    # mm(g, "e5", "e4")