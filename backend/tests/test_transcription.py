import pytest


@pytest.mark.asyncio
async def test_health_check(client):
    response = await client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


@pytest.mark.asyncio
async def test_transcribe_note_no_file(client):
    response = await client.post("/api/transcribe/note")
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_transcribe_note_with_wav(client, sample_wav):
    response = await client.post(
        "/api/transcribe/note",
        files={"file": ("test.wav", sample_wav, "audio/wav")},
    )
    assert response.status_code == 200
    data = response.json()
    assert "detected" in data


@pytest.mark.asyncio
async def test_transcribe_chord_with_wav(client, sample_wav):
    response = await client.post(
        "/api/transcribe/chord",
        files={"file": ("test.wav", sample_wav, "audio/wav")},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["detected"] is True
