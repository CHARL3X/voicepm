from setuptools import setup, find_packages

setup(
    name="voicepm",
    version="1.0.0",
    packages=find_packages(),
    install_requires=[
        "fastapi",
        "uvicorn",
        "openai",
        "python-multipart",
        "pydantic",
        "pydantic-settings"
    ]
)