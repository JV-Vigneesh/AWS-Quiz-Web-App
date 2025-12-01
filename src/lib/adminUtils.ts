type AnyObj = Record<string, any>;

function getAttr(attrs: AnyObj[] | undefined, name: string) {
  if (!attrs) return undefined;
  return attrs.find((a) => a.Name === name || a.name === name)?.Value;
}

export function normalizeUsersPayload(data: any): Array<AnyObj> {
  const raw =
    data?.users ??
    data?.Users ??
    (Array.isArray(data) ? data : []) ??
    [];

  return raw.map((u: AnyObj) => {
    const email =
      getAttr(u.Attributes, "email") ??
      u.email ??
      u.Email ??
      u.user_email;

    const nameFromAttrs =
      getAttr(u.Attributes, "name") ||
      [
        getAttr(u.Attributes, "given_name"),
        getAttr(u.Attributes, "family_name"),
      ]
        .filter(Boolean)
        .join(" ")
        .trim();

    const preferred =
      getAttr(u.Attributes, "preferred_username") ||
      getAttr(u.Attributes, "nickname");

    const name =
      nameFromAttrs ||
      preferred ||
      u.name ||
      u.Username ||
      (email ? email.split("@")[0] : "User");

    const cognitoGroups = u?.Groups || u?.groups || u?.cognitoGroups;

    const group =
      (Array.isArray(cognitoGroups) && cognitoGroups[0]) ||
      getAttr(u.Attributes, "custom:group") ||
      u.group ||
      "User";

    return {
      email,
      name,
      username: u.Username,
      group,
    };
  });
}

export function normalizeScoresPayload(data: any): Array<AnyObj> {
  const raw =
    data?.scores ??
    data?.Items ??
    (Array.isArray(data) ? data : []) ?? [];

  return raw.map((s: AnyObj) => ({
    response_id:
      s.result_id ||
      s.response_id ||
      s.id ||
      s.responseId ||
      s.pk ||
      s.PK ||
      "N/A",
    quiz_id: s.quiz_id || s.quizId || s.sk || s.SK || s.title || "N/A",
    user_name:
      s.user_name ||
      s.username ||
      s.user ||
      s.name ||
      s.user_email ||
      s.email ||
      "N/A",
    user_email: s.user_email || s.email,
    score: s.score ?? s.marks ?? s.total ?? s.result ?? "N/A",
    answers: s.answers || s.response || s.responses || null,
  }));
}

export function generateCreatedAt() {
  const d = new Date();
  const pad = (n: number, size = 2) => String(n).padStart(size, "0");

  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(
    d.getUTCDate()
  )}T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(
    d.getUTCSeconds()
  )}.${String(d.getUTCMilliseconds()).padStart(3, "0")}000`;
}
