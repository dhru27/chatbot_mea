#!/bin/bash

# Run tests with coverage report
pytest --cov=app  -v -k "not email" tests/ --cov-report=term-missing

# Exit with the pytest exit code
exit $? 