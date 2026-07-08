/**
 * Atom · CornerFrame
 * Marcas de esquina estilo visor/crosshair (líneas de dirección) que enmarcan
 * una superficie (hero visual, foto de producto). Decorativo, aria-hidden.
 */

export function CornerFrame() {
  return (
    <>
      <span className="corner-frame__mark corner-frame__mark--tl" aria-hidden />
      <span className="corner-frame__mark corner-frame__mark--tr" aria-hidden />
      <span className="corner-frame__mark corner-frame__mark--bl" aria-hidden />
      <span className="corner-frame__mark corner-frame__mark--br" aria-hidden />
    </>
  );
}
