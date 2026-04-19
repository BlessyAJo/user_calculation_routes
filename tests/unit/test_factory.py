import pytest
from app.factory.calculation_factory import CalculationFactory


# -------------------------
# VALID OPERATIONS
# -------------------------
@pytest.mark.parametrize(
    "a,b,op,expected",
    [
        (10, 5, "addition", 15),
        (10, 5, "subtraction", 5),
        (10, 5, "multiplication", 50),
        (10, 5, "division", 2),
        (-10, 5, "addition", -5),
        (2.5, 2, "multiplication", 5.0),
    ]
)
def test_factory_valid_operations(a, b, op, expected):
    result = CalculationFactory.create(a, b, op)
    assert result == expected


# -------------------------
# DIVISION BY ZERO
# -------------------------
def test_factory_division_by_zero():
    with pytest.raises(ValueError, match="Division by zero"):
        CalculationFactory.create(10, 0, "division")


# -------------------------
# INVALID OPERATION TYPE
# -------------------------
@pytest.mark.parametrize(
    "op",
    ["modulus", "addd", "", "random", "123"]
)
def test_factory_invalid_operation(op):
    with pytest.raises(ValueError, match="Invalid operation type"):
        CalculationFactory.create(10, 5, op)


# -------------------------
# CASE INSENSITIVITY + SPACES
# -------------------------
def test_factory_case_and_spaces():
    result = CalculationFactory.create(10, 5, "  AdDiTiOn  ")
    assert result == 15