import copy

class Checkers:
    DEPTH = 5
    initial_board = [
        [0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [-1, 0, -1, 0, -1, 0, -1, 0],
        [0, -1, 0, -1, 0, -1, 0, -1],
        [-1, 0, -1, 0, -1, 0, -1, 0]
    ]

    def __init__(self):
        self.current_board = copy.deepcopy(self.initial_board)

    def evaluate_board(self, board):
        # Simple evaluation function: count pieces
        ai_score = sum(row.count(1) + row.count(2) * 1.5 for row in board)
        player_score = sum(row.count(-1) + row.count(-2) * 1.5 for row in board)
        return ai_score - player_score

    def get_possible_moves(self, board, player):
            moves = []
            for row in range(8):
                for col in range(8):
                    if board[row][col] == player or board[row][col] == player * 2:  # Regular or king
                        is_king = board[row][col] == player * 2
                        # Directions: forward for regular pieces, forward and backward for kings
                        directions = [1] if player == 1 else [-1]  # Forward for regular pieces
                        if is_king:
                            directions = [1, -1]  # Kings move both ways

                        # Normal moves
                        for direction in directions:
                            for d_col in [-1, 1]:
                                new_row = row + direction
                                new_col = col + d_col
                                if 0 <= new_row < 8 and 0 <= new_col < 8 and board[new_row][new_col] == 0:
                                    moves.append((row, col, new_row, new_col))

                        # Capture moves
                        for direction in directions:
                            for d_col in [-1, 1]:
                                new_row = row + direction * 2
                                new_col = col + d_col * 2
                                mid_row = row + direction
                                mid_col = col + d_col
                                if (0 <= new_row < 8 and 0 <= new_col < 8 and
                                        0 <= mid_row < 8 and 0 <= mid_col < 8 and
                                        board[mid_row][mid_col] in [-player, -player * 2] and
                                        board[new_row][new_col] == 0):
                                    moves.append((row, col, new_row, new_col))
            return moves

    def apply_move(self, board, move):
        from_row, from_col, to_row, to_col = move
        new_board = copy.deepcopy(board)
        new_board[to_row][to_col] = new_board[from_row][from_col]
        new_board[from_row][from_col] = 0
        
        # Handle capture
        if abs(from_row - to_row) == 2:
            mid_row = (from_row + to_row) // 2
            mid_col = (from_col + to_col) // 2
            new_board[mid_row][mid_col] = 0

        # Promote to King
        if to_row == 0 and new_board[to_row][to_col] == -1:  # Black piece becomes King
            new_board[to_row][to_col] = -2
        if to_row == 7 and new_board[to_row][to_col] == 1:  # Red piece becomes King
            new_board[to_row][to_col] = 2

        return new_board

    def minimax(self, board, depth, maximizing_player, alpha, beta):
        if depth == 0 or not self.has_moves(1 if maximizing_player else -1):
            return self.evaluate_board(board), None

        best_move = None
        if maximizing_player:
            max_eval = float('-inf')
            for move in self.get_possible_moves(board, 1):
                eval, _ = self.minimax(self.apply_move(board, move), depth - 1, False, alpha, beta)
                if eval > max_eval:
                    max_eval = eval
                    best_move = move
                alpha = max(alpha, eval)
                if beta <= alpha:
                    break
            return max_eval, best_move
        else:
            min_eval = float('inf')
            for move in self.get_possible_moves(board, -1):
                eval, _ = self.minimax(self.apply_move(board, move), depth - 1, True, alpha, beta)
                if eval < min_eval:
                    min_eval = eval
                    best_move = move
                beta = min(beta, eval)
                if beta <= alpha:
                    break
            return min_eval, best_move

    def apply_player_move(self, move):
        self.current_board = self.apply_move(self.current_board, move)

    def get_ai_move(self):
        _, ai_move = self.minimax(self.current_board, self.DEPTH, True, float('-inf'), float('inf'))
        if ai_move:
            self.current_board = self.apply_move(self.current_board, ai_move)
        return ai_move

    def has_moves(self, player):
        return bool(self.get_possible_moves(self.current_board, player))

    def reset(self):
        self.current_board = copy.deepcopy(self.initial_board)
