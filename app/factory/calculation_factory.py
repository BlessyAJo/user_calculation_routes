class CalculationFactory:

    @staticmethod
    def create(a: float, b: float, op_type: str) -> float:

        op_type = op_type.lower().strip()

        operations = {
            "addition": lambda a, b: a + b,
            "subtraction": lambda a, b: a - b,
            "multiplication": lambda a, b: a * b,
            "division": lambda a, b: a / b if b != 0 else (_ for _ in ()).throw(ValueError("Division by zero is not allowed"))
        }

        try:
            return operations[op_type](a, b)
        except KeyError:
            raise ValueError(
                "Invalid operation type. Must be one of: addition, subtraction, multiplication, division."
            )