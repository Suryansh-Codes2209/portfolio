import { STACK_FRAMES } from "../durations";
import { categories } from "../../app/data/stack";
import { ChapterTag } from "../primitives/caption";
import { Drop } from "../primitives/drop";
import { Kinetic } from "../primitives/kinetic";
import { useLayout } from "../primitives/layout";
import { Paper } from "../primitives/paper";
import { Typewriter } from "../primitives/typewriter";
import { C, F, jitter } from "../theme";

export { STACK_FRAMES };

// CSS vars don't exist inside a render — map the token to the pen colour.
const ink = (color: string) => (color.startsWith("var(") ? C.pen : color);

/** Ch.3 — the toolkit, as stickers raining onto the page in their groups. */
export function Stack() {
  const { portrait, pad } = useLayout();
  const cols = portrait ? 2 : 3;
  let n = 0;

  return (
    <Paper color={C.paper2}>
      <ChapterTag n={3} label="The toolkit" from={2} />
      <div style={{ position: "absolute", left: pad, top: portrait ? 150 : 120, width: portrait ? 940 : 1500 }}>
        <Kinetic text="Agents, backends, frontends. One person." from={6} size={portrait ? 84 : 76} mark={["One", "person."]} />
      </div>

      <div
        style={{
          position: "absolute",
          left: pad,
          right: pad,
          top: portrait ? 470 : 310,
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          columnGap: 50,
          rowGap: portrait ? 50 : 70,
        }}
      >
        {categories.map((cat, ci) => (
          <div key={cat.label}>
            <div style={{ fontSize: 22, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 14 }}>
              <Typewriter text={cat.label} from={24 + ci * 10} cps={30} caret={false} style={{ color: C.pen }} />
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
              {cat.items.map((t) => {
                const delay = 40 + n++ * 4;
                return (
                  <Drop key={t.name} from={delay} rotate={jitter(t.name) * 4} dy={-200} style={{ position: "relative" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "11px 20px",
                        background: "#fff",
                        border: `2px solid ${C.ink}`,
                        borderRadius: 999,
                        fontFamily: F.sans,
                        fontWeight: 500,
                        fontSize: 26,
                        color: C.ink,
                      }}
                    >
                      <t.Icon style={{ width: 26, height: 26, color: ink(t.color) }} />
                      {t.name}
                    </div>
                  </Drop>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </Paper>
  );
}
