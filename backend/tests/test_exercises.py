import pytest


@pytest.mark.asyncio
async def test_scale_id_challenge(client):
    response = await client.get("/api/exercises/scale-id?tier=1")
    assert response.status_code == 200
    data = response.json()
    assert "challenge_id" in data
    assert len(data["choices"]) >= 2


@pytest.mark.asyncio
async def test_interval_id_challenge(client):
    response = await client.get("/api/exercises/interval-id?tier=1")
    assert response.status_code == 200
    data = response.json()
    assert "challenge_id" in data
    assert len(data["choices"]) >= 2


@pytest.mark.asyncio
async def test_curriculum(client):
    response = await client.get("/api/curriculum")
    assert response.status_code == 200
    data = response.json()
    assert len(data["tiers"]) >= 3
