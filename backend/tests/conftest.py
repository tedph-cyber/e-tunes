import pytest
from httpx import AsyncClient, ASGITransport

from app.main import app


@pytest.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest.fixture
def sample_wav():
    import struct
    import math
    import io
    sr = 22050
    duration = 1.0
    freq = 440.0
    num_samples = int(sr * duration)
    samples = []
    for i in range(num_samples):
        t = i / sr
        value = int(0.3 * math.sin(2 * math.pi * freq * t) * 32767)
        samples.append(value)

    buf = io.BytesIO()
    buf.write(b"RIFF")
    data_size = num_samples * 2
    buf.write(struct.pack("<I", 36 + data_size))
    buf.write(b"WAVE")
    buf.write(b"fmt ")
    buf.write(struct.pack("<I", 16))
    buf.write(struct.pack("<H", 1))
    buf.write(struct.pack("<H", 1))
    buf.write(struct.pack("<I", sr))
    buf.write(struct.pack("<I", sr * 2))
    buf.write(struct.pack("<H", 2))
    buf.write(struct.pack("<H", 16))
    buf.write(b"data")
    buf.write(struct.pack("<I", data_size))
    buf.write(struct.pack(f"<{num_samples}h", *samples))
    return buf.getvalue()
