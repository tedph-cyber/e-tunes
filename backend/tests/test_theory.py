import pytest
from app.theory.generator import generate_scales, generate_chords, bitmask_from_intervals


def test_scales_generated():
    scales = generate_scales()
    assert len(scales) > 10
    assert "major" in scales
    assert "dorian" in scales


def test_major_scale_correct():
    scales = generate_scales()
    major = scales["major"]
    assert major.intervals == [0, 2, 4, 5, 7, 9, 11]
    assert major.cardinality == 7
    assert major.bitmask == bitmask_from_intervals([0, 2, 4, 5, 7, 9, 11])


def test_chords_generated():
    chords = generate_chords()
    assert len(chords) > 5
    assert "maj" in chords
    assert "min" in chords


def test_chord_qualities():
    chords = generate_chords()
    assert chords["maj"].quality == "major"
    assert chords["min"].quality == "minor"
    assert chords["dim"].quality == "diminished"


@pytest.mark.asyncio
async def test_list_scales(client):
    response = await client.get("/api/scales")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] > 10


@pytest.mark.asyncio
async def test_get_scale(client):
    response = await client.get("/api/scales/major")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Major (Ionian)"


@pytest.mark.asyncio
async def test_get_scale_not_found(client):
    response = await client.get("/api/scales/nonexistent")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_list_chords(client):
    response = await client.get("/api/chords")
    assert response.status_code == 200
    assert response.json()["total"] > 5


@pytest.mark.asyncio
async def test_list_intervals(client):
    response = await client.get("/api/intervals")
    assert response.status_code == 200
    data = response.json()
    assert len(data["intervals"]) >= 12
