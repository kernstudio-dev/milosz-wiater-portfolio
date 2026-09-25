# Reference Orb and Selected Work Audit

Reference: https://vanlent.dev/  
Observed live at 1440 × 900 before implementation. No source code or assets were copied.

## Orb behavior

### Hero — stationary observation, 10 seconds

- T=0: compact asymmetric volume with a flatter upper plane and a heavier lower-left edge.
- T=3: the upper mass rounds out while the lower contour compresses and the right side opens.
- T=6: the form becomes taller, with a softer triangular contour and a different lower fold.
- T=10: deformation continues; it does not settle into the T=0 silhouette.
- Full-frame changed-pixel ratios were 2.38%, 2.11%, and 2.13% across the measured intervals, with the rest of the layout stationary.
- The motion reads as changing topology/folds plus slow non-mechanical rotation, not as brightness flicker.

### Selected Work

- The orb becomes a smaller purple fibrous form placed behind/beside the project viewer.
- Its outer contour and internal membranes continue changing while the project remains selected.
- One desktop media view and one narrow/mobile view form a coordinated dominant composition.
- A four-frame preview strip, project title, copy, previous/next arrows and project link move as one viewer.
- The project media itself remains alive while idle; successive frames reveal different parts of the experience.
- Next/previous controls change the active project. The transition temporarily clears/masks the dominant media before the incoming project resolves.

### Services — stationary observation, 12 seconds

- The orb becomes warmer, denser and more compact than the Work state.
- Fine internal lines move continuously while the perimeter gently expands, compresses and changes its local folds.
- Full-frame changed-pixel ratios were 3.34% and 3.22% across two six-second intervals.
- Service composition/copy changed during the 12-second stationary observation.
- The service scene also contains independently moving supporting content, but the orb remains the central living form.

### About

- The object becomes light, open and sculptural, with larger petal-like membranes and a calmer tempo.
- Between T=0 and T=6, the main folds rotate and redistribute while the exterior remains soft rather than turbulent.
- The object supports the portrait and copy instead of competing with them.

### Contact

- The form becomes more symmetrical and ordered, reading as a dense nested shell.
- It still changes noticeably: the core drifts, the boundary compresses, and internal rings reorganize.
- The state is controlled but not static.

## Implementation conclusions

- Keep one persistent point mesh and preserve the existing macro travel path.
- Make idle deformation visibly affect the silhouette at low, medium and fine spatial scales.
- Drive rotation with several slow, non-matching temporal components.
- Interpolate section and service personalities on the existing mesh; never replace the orb.
- Keep Work dominated by one large media viewport, but make the preview strip carry thumbnail, number and project name.
- Coordinate media, title, metadata, index and thumbnail state during project changes.
- Preserve a mask-based transition from Selected Work into the case study.
