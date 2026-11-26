import { pinMapHtml, readPinMessage, recenterMap, setPinScript } from './pin-map';

describe('pin map', () => {
  it('builds a map page centered on the given spot', () => {
    const html = pinMapHtml(12.9716, 77.5946);
    expect(html).toContain('https://tile.openstreetmap.org/{z}/{x}/{y}.png');
    expect(html).toContain('attributionControl: false');
    expect(html).toContain('.leaflet-control-attribution { display: none !important; }');
    expect(html).not.toContain('OpenStreetMap');
    expect(html).toContain('setView([12.9716, 77.5946], 16)');
    expect(html).toContain('userGesture');
    expect(setPinScript(12.95, 77.61)).toBe('window.setPin(12.95, 77.61); true;');
  });

  it('recenters only when a map handle is attached', () => {
    const map = { injectJavaScript: jest.fn() };
    recenterMap(null, 1, 2);
    expect(map.injectJavaScript).not.toHaveBeenCalled();
    recenterMap(map, 12.95, 77.61);
    expect(map.injectJavaScript).toHaveBeenCalledWith('window.setPin(12.95, 77.61); true;');
  });

  it('reads a pan message and ignores anything else', () => {
    expect(readPinMessage('{')).toBeNull();
    expect(readPinMessage('null')).toBeNull();
    expect(readPinMessage('[]')).toBeNull();
    expect(readPinMessage('1')).toBeNull();
    expect(readPinMessage('{"latitude":"north","longitude":77}')).toBeNull();
    expect(readPinMessage('{"latitude":12.95,"longitude":"east"}')).toBeNull();
    expect(readPinMessage('{"latitude":null,"longitude":77.61}')).toBeNull();
    expect(readPinMessage('{"latitude":1e309,"longitude":77.61}')).toBeNull();
    expect(readPinMessage('{"latitude":12.95,"longitude":1e309}')).toBeNull();
    expect(readPinMessage('{"latitude":12.95,"longitude":77.61}')).toEqual({
      latitude: 12.95,
      longitude: 77.61,
    });
  });
});
