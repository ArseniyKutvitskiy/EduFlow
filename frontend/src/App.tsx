import { useEffect, useState } from "react";
import "./App.css";
import "./admin-fixes.css";
import "./admin-layout-repair.css";
import "./teacher-empty.css";
import "./teacher-empty-center.css";
import "./material-select-fix.css";
import "./teacher-metrics-fix.css";
import "./submission-review.css";
import "./assignment-meta.css";
const api = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const telegramContact = (import.meta.env.VITE_TELEGRAM_CONTACT || "").trim();
const telegramCourseLink = (courseTitle: string) => telegramContact || `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`Здравствуйте! Хочу записаться на курс «${courseTitle}».`)}`;
const courseMarketing = (title: string) => {
  const copy: Record<string, { lead: string; audience: string; result: string }> = {
    "Python для анализа данных": { lead: "Научитесь превращать данные в понятные выводы и уверенно работать с аналитическими задачами.", audience: "Тем, кто хочет начать путь в аналитике, автоматизировать рутинные расчёты или принимать решения на основе данных.", result: "Базовые навыки Python, работа с таблицами и визуализация результатов для реальных задач." },
    "UX/UI-дизайн цифровых продуктов": { lead: "Создавайте понятные цифровые продукты, которыми приятно пользоваться.", audience: "Новичкам в дизайне и специалистам, которые хотят системно развить продуктовое мышление.", result: "Понимание пользовательского опыта, прототипирование и сильные решения для портфолио." },
    "Управление IT-проектами": { lead: "Освойте инструменты, которые помогают команде двигаться к результату без хаоса.", audience: "Тем, кто уже работает с командами или планирует вырасти до роли менеджера проектов.", result: "Навыки планирования, постановки задач, управления рисками и коммуникацией с командой." },
    "Проектирование баз данных": { lead: "Научитесь создавать надёжную структуру данных для современных сервисов и продуктов.", audience: "Начинающим разработчикам и тем, кому важно разобраться в логике хранения данных.", result: "Уверенное понимание моделей данных, связей, SQL и проектирования баз данных." },
    "React: от компонентов к приложению": { lead: "Соберите современное веб-приложение и поймёте, как устроена разработка на React.", audience: "Тем, кто уже знает основы веб-разработки и готов перейти к созданию интерфейсов.", result: "Компонентное мышление, состояние приложения и проект, который можно показать в портфолио." },
    "Основы веб-разработки": { lead: "Сделайте уверенный первый шаг в создании сайтов и цифровых интерфейсов.", audience: "Новичкам без технической подготовки, которые хотят войти в веб-разработку с нуля.", result: "Основа HTML, CSS и JavaScript, а также первые самостоятельные веб-страницы." },
  };
  return copy[title] || { lead: "Практическая программа, которая помогает освоить востребованный навык и применить его в работе.", audience: "Тем, кто хочет развиваться в новой профессии и учиться на понятных задачах.", result: "Структурированные знания, практика и уверенность в следующем карьерном шаге." };
};
const H = (t: string) => ({
  Authorization: "Bearer " + t,
  "Content-Type": "application/json",
});
const deadlineText = (value: string) => {
  const days = Math.ceil((new Date(value).getTime() - Date.now()) / 86400000);
  const date = new Date(value).toLocaleDateString("ru-RU");
  return days < 0 ? `${date} · просрочено на ${Math.abs(days)} дн.` : `${date} · осталось ${days} дн.`;
};
export default function App() {
  const [p, setP] = useState(() => window.location.hash.replace("#", "") || "home"),
    [u, setU] = useState<any>(() =>
      JSON.parse(localStorage.getItem("user") || "null"),
    ),
    [cs, setCs] = useState<any[]>([]),
    [d, setD] = useState<any>(null),
    [focusedAssignment, setFocusedAssignment] = useState<number | null>(null),
    [q, setQ] = useState(""),
    [catalogCategory, setCatalogCategory] = useState("all"),
    [m, setM] = useState(""),
    [authMode, setAuthMode] = useState<"login" | "register">("login"),
    [form, setForm] = useState({
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    });
  const t = localStorage.getItem("token") || "";
  const logout = () => {
    localStorage.clear();
    setU(null);
    setP("home");
  };
  useEffect(() => {
    fetch(api + "/courses?search=" + q)
      .then((x) => x.json())
      .then((x) => setCs(x.items || []));
  }, [q]);
  useEffect(() => {
    if (u && p === "home") setP("desk");
  }, [u, p]);
  useEffect(() => {
    if (window.location.hash !== `#${p}`) window.history.replaceState(null, "", `#${p}`);
  }, [p]);
  useEffect(() => {
    const onHashChange = () => setP(window.location.hash.replace("#", "") || "home");
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);
  useEffect(() => {
    if (!m) return;
    const timer = window.setTimeout(() => setM(""), 5000);
    return () => window.clearTimeout(timer);
  }, [m]);
  const login = async (e: any) => {
    e.preventDefault();
    let r = await fetch(api + "/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }),
      x = await r.json();
    if (!r.ok) return setM(x.message);
    localStorage.setItem("token", x.token);
    localStorage.setItem("user", JSON.stringify(x.user));
    setU(x.user);
    setP("desk");
  };
  const register = async (e: any) => {
    e.preventDefault();
    const r = await fetch(api + "/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const x = await r.json();
    if (!r.ok) return setM(x.message || "Не удалось создать аккаунт.");
    localStorage.setItem("token", x.token);
    localStorage.setItem("user", JSON.stringify(x.user));
    setU(x.user);
    setP("desk");
  };
  const open = async (id: number, assignmentId?: number) => {
    setD(await fetch(api + "/courses/" + id).then((x) => x.json()));
    setFocusedAssignment(assignmentId || null);
    setP("course");
  };
  const openAssignment = async (courseId: number, assignmentId: number) => {
    setD(await fetch(api + "/courses/" + courseId).then((x) => x.json()));
    setFocusedAssignment(assignmentId);
    setP("assignment");
  };
  const enroll = async (id: number) => {
    let r = await fetch(api + `/courses/${id}/enroll`, {
      method: "POST",
      headers: H(t),
    });
    setM(
      r.ok
        ? "Вы записаны на курс. Он появился в «Моих курсах»."
        : u
          ? "Вы уже записаны или ваша роль не позволяет записаться."
          : "Сначала войдите как студент.",
    );
  };
  return (
    <>
      <header>
        <button className="brand" onClick={() => setP(u ? "desk" : "home")}>
          ✦ EduFlow
        </button>
        <nav>
          {!u && <button onClick={() => setP("catalog")}>Каталог</button>}
          {u && (
            <button onClick={() => setP("desk")}>Главная</button>
          )}
          {u && u.role !== "Administrator" && <button onClick={() => setP("program")}>Курс</button>}
          {u && u.role !== "Administrator" && <button onClick={() => setP("materials")}>Учебные материалы</button>}
          {u && u.role !== "Administrator" && <button onClick={() => setP("tasks")}>Домашние задания</button>}
          {u && <button className="profileTrigger" onClick={() => setP("profile")}>{u.avatarUrl ? <img src={u.avatarUrl} alt="Профиль" /> : <span>{u.firstName?.[0]}{u.lastName?.[0]}</span>}</button>}
          {!u && <button className="btn ghost" onClick={() => setP("login")}>Войти</button>}
        </nav>
      </header>
      {m && (
        <div className="toast" onClick={() => setM("")}>
          {m} ×
        </div>
      )}
      <main>
        {p === "home" && <Home go={setP} />}{" "}
        {p === "catalog" && (() => { const categories = Array.from(new Set(cs.map((c: any) => c.category).filter(Boolean))); const visibleCourses = cs.filter((c: any) => catalogCategory === "all" || c.category === catalogCategory); return <section className="catalogPage"><div className="catalogWrap"><div className="catalogHero"><div><span>КАТАЛОГ ПРОГРАММ</span><h1>Выберите направление, <em>которое вдохновляет.</em></h1><p>Практические онлайн-курсы с понятной программой и поддержкой на всём пути обучения.</p></div><label className="catalogSearch">⌕<input placeholder="Поиск по программам" value={q} onChange={(e) => setQ(e.target.value)}/></label></div><div className="catalogFilters"><button className={catalogCategory === "all" ? "active" : ""} onClick={() => setCatalogCategory("all")}>Все программы</button>{categories.map((category: any) => <button className={catalogCategory === category ? "active" : ""} onClick={() => setCatalogCategory(category)}>{category}</button>)}</div><div className="catalogMeta"><span>Найдено программ: <b>{visibleCourses.length}</b></span><small>Нажмите на карточку, чтобы посмотреть программу и оставить заявку</small></div><div className="catalogGrid">{visibleCourses.map((c: any, i: number) => <article className={"catalogCard catalogTone" + (i % 3)} role="button" tabIndex={0} onClick={() => open(c.id)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") open(c.id); }}><div className="catalogCardTop"><span>{c.category || "ОНЛАЙН-КУРС"}</span><i>✦</i></div><div className="catalogCardBody"><small>ПРАКТИЧЕСКАЯ ПРОГРАММА</small><h2>{c.title}</h2><p>{c.description || "Подробное описание программы появится в карточке курса."}</p><div className="catalogCardTags"><span>Онлайн-формат</span><span>Практика</span></div></div></article>)}</div>{!visibleCourses.length && <div className="catalogEmpty"><i>⌕</i><h2>Ничего не найдено</h2><p>Попробуйте изменить поисковый запрос или выбрать другое направление.</p></div>}</div></section>; })()}
        {p === "course" && (
          <Course
            d={d}
            u={u}
            t={t}
            back={() => setP(u ? "desk" : "catalog")}
            openAssignment={openAssignment}
            say={setM}
            enroll={enroll}
          />
        )}{" "}
        {p === "assignment" && (
          <AssignmentPage
            d={d}
            assignmentId={focusedAssignment}
            t={t}
            back={() => setP("tasks")}
            say={setM}
          />
        )}
        {p === "login" && (
          <section className="login">
            <div className="authShell">
              <aside className="authStory">
                <div className="storyMark">✦</div>
                <span>ВАШЕ ОБУЧЕНИЕ — В ОДНОМ МЕСТЕ</span>
                <h2>
                  Знания, которые
                  <br />
                  <em>становятся делом.</em>
                </h2>
                <p>
                  Выбирайте курсы, учитесь в удобном темпе и получайте обратную
                  связь от преподавателя.
                </p>
                <div className="storySteps">
                  <b>
                    <i>01</i> Пройдите материалы
                  </b>
                  <b>
                    <i>02</i> Выполните задание
                  </b>
                  <b>
                    <i>03</i> Получите оценку
                  </b>
                </div>
                <small>EduFlow · цифровая образовательная среда</small>
              </aside>
              <form onSubmit={authMode === "login" ? login : register}>
                <span>
                  {authMode === "login"
                    ? "ВХОД В EDUFLOW"
                    : "РЕГИСТРАЦИЯ СТУДЕНТА"}
                </span>
                <h1>
                  {authMode === "login" ? "С возвращением!" : "Начните учиться"}
                </h1>
                <p>
                  {authMode === "login"
                    ? "Введите данные своей учётной записи."
                    : "Создайте личный кабинет студента — это займёт минуту."}
                </p>
                <div className="authTabs">
                  <button
                    type="button"
                    className={authMode === "login" ? "selected" : ""}
                    onClick={() => setAuthMode("login")}
                  >
                    Вход
                  </button>
                  <button
                    type="button"
                    className={authMode === "register" ? "selected" : ""}
                    onClick={() => setAuthMode("register")}
                  >
                    Регистрация
                  </button>
                </div>
                {authMode === "register" && (
                  <div className="nameFields">
                    <label>
                      Имя
                      <input
                        required
                        value={form.firstName}
                        onChange={(e) =>
                          setForm({ ...form, firstName: e.target.value })
                        }
                      />
                    </label>
                    <label>
                      Фамилия
                      <input
                        required
                        value={form.lastName}
                        onChange={(e) =>
                          setForm({ ...form, lastName: e.target.value })
                        }
                      />
                    </label>
                  </div>
                )}
                <label>
                  E-mail
                  <input
                    required
                    type="email"
                    placeholder="name@example.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                </label>
                <label>
                  Пароль
                  <input
                    required
                    minLength={6}
                    placeholder="Минимум 6 символов"
                    type="password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                  />
                </label>
                <button className="btn">
                  {authMode === "login"
                    ? "Войти в аккаунт →"
                    : "Создать аккаунт →"}
                </button>
                <small className="authHint">
                  {authMode === "login"
                    ? "Нет аккаунта? "
                    : "Уже зарегистрированы? "}
                  <button
                    type="button"
                    onClick={() =>
                      setAuthMode(authMode === "login" ? "register" : "login")
                    }
                  >
                    {authMode === "login" ? "Зарегистрироваться" : "Войти"}
                  </button>
                </small>
              </form>
            </div>
          </section>
        )}
        {p === "desk" && <Desk u={u} t={t} open={open} openAssignment={openAssignment} say={setM} go={setP} />}
        {p === "tasks" && <Desk u={u} t={t} open={open} openAssignment={openAssignment} say={setM} go={setP} taskOnly />}
        {p === "program" && <CourseProgramPage user={u} token={t} say={setM} />}
        {p === "materials" && <MaterialsPage user={u} token={t} say={setM} />}
        {p === "profile" && <ProfilePage user={u} token={t} back={() => setP("desk")} logout={logout} onUserChange={setU} />}
      </main>
    </>
  );
}
function Home({ go }: any) {
  return (
    <>
      <section className="commercialHero">
        <div className="commercialLead"><span>ОНЛАЙН-ОБУЧЕНИЕ С ПОДДЕРЖКОЙ ПРЕПОДАВАТЕЛЯ</span><h1>Освойте навык, который <em>даёт результат.</em></h1><p>Практические программы для тех, кто хочет развиваться в профессии: понятные уроки, задания и обратная связь от эксперта.</p><div className="commercialCta"><button className="btn" onClick={() => go("catalog")}>Смотреть программы →</button><small>Оставьте заявку — менеджер поможет выбрать курс</small></div></div>
        <aside className="commercialPreview"><div className="previewTop"><span>ВАШ НОВЫЙ НАВЫК</span><i>✦</i></div><h2>Учитесь в удобном темпе</h2><p>Материалы доступны онлайн, а преподаватель помогает закрепить знания на практике.</p><div className="previewSteps"><b><i>01</i> Выбираете программу</b><b><i>02</i> Учитесь и выполняете задания</b><b><i>03</i> Получаете обратную связь</b></div><div className="previewNote"><i>✓</i><span>Персональная поддержка на каждом этапе</span></div></aside>
      </section>
      <section className="commercialBenefits"><div className="commercialSectionHead"><span>ПОЧЕМУ EDUFLOW</span><h2>Обучение, которое ведёт к практике</h2><p>Всё необходимое для уверенного старта — в одной программе.</p></div><div className="benefitGrid"><article><i>◎</i><h3>Понятная программа</h3><p>Последовательные уроки без лишней теории и перегруза.</p></article><article><i>↗</i><h3>Практические задания</h3><p>Закрепляйте материал на реальных задачах и собирайте портфолио.</p></article><article><i>✦</i><h3>Обратная связь</h3><p>Получайте комментарии преподавателя и понимайте, куда двигаться дальше.</p></article></div></section>
      <section className="commercialBottom"><div><span>ГОТОВЫ НАЧАТЬ?</span><h2>Выберите направление и сделайте первый шаг.</h2></div><button className="btn" onClick={() => go("catalog")}>Перейти в каталог →</button></section>
    </>
  );
}
function Course({ d, u, back, openAssignment }: any) {
  if (!d) return null;
  const isStudent = u?.role === "Student";
  const isGuest = !u;
  const marketing = courseMarketing(d.title);
  return (
    <section className="section coursePage">
      <button className="back" onClick={back}>
        ← {isStudent ? "К домашним заданиям" : "Назад к каталогу"}
      </button>
      <div className={"courseHero " + (isStudent ? "studentCourseHero" : "")}>
        <div>
          <span>{isStudent ? "УЧЕБНОЕ ПРОСТРАНСТВО · КУРС" : d.category?.name}</span>
          <h1>{d.title}</h1>
          <p>{isGuest ? marketing.lead : d.description}</p>
        </div>
        <aside>
          {isGuest ? <><small>ОНЛАЙН-ПРОГРАММА</small><strong>Учитесь в удобном темпе</strong><p>Практика и обратная связь в личном кабинете.</p><a className="courseEnroll" href={telegramCourseLink(d.title)} target="_blank" rel="noreferrer">Оставить заявку →</a></> : <><small>ПРЕПОДАВАТЕЛЬ</small><strong>{d.teacher?.firstName} {d.teacher?.lastName}</strong></>}
        </aside>
      </div>
      {isGuest ? <section className="courseOffer"><div className="courseOfferHead"><span>О ПРОГРАММЕ</span><h2>Вы получите навык, который можно применить.</h2><p>Обучение построено так, чтобы двигаться от понятной базы к самостоятельной практике.</p></div><div className="courseOfferGrid"><article><i>◎</i><small>КОМУ ПОДОЙДЁТ</small><h3>Начните с уверенности</h3><p>{marketing.audience}</p></article><article><i>✦</i><small>РЕЗУЛЬТАТ</small><h3>Знания, которые работают</h3><p>{marketing.result}</p></article><article><i>↗</i><small>ФОРМАТ</small><h3>Онлайн и в вашем темпе</h3><p>Уроки, материалы и задания собраны в личном кабинете. Преподаватель помогает по ходу обучения.</p></article></div><div className="courseOfferCta"><div><b>Готовы выбрать курс?</b><span>Напишите нам в Telegram — поможем с программой и условиями обучения.</span></div><a className="btn" href={telegramCourseLink(d.title)} target="_blank" rel="noreferrer">Записаться в Telegram →</a></div></section> : <><h2>{isStudent ? "Материалы курса" : "Программа обучения"}</h2>{d.modules?.map((x: any) => (<article className="module"><b>Модуль {x.position}. {x.title}</b><p>{x.description}</p>{x.materials?.map((z: any) => (<a href={z.url} target="_blank">↗ {z.title} <small>({z.type})</small></a>))}</article>))}<h2>{isStudent ? "Задания по курсу" : "Практические задания"}</h2>{d.assignments?.map((a: any) => (<article className="assignment"><div><b>{a.title}</b><p>{a.description}</p><small>Дедлайн: {new Date(a.dueDate).toLocaleDateString("ru-RU")} · до {a.maxScore} баллов</small></div>{u?.role === "Student" && (<button className="btn" onClick={() => openAssignment(d.id, a.id)}>Открыть задание</button>)}</article>))}</>}
    </section>
  );
}
function AssignmentPage({ d, assignmentId, t, back, say }: any) {
  const [submission, setSubmission] = useState<any>(null),
    [text, setText] = useState(""),
    [url, setUrl] = useState(""),
    [file, setFile] = useState<File | null>(null);
  const assignment = d?.assignments?.find((x: any) => x.id === assignmentId);
  useEffect(() => {
    fetch(api + "/student/dashboard", { headers: H(t) })
      .then((r) => r.json())
      .then((courses) => {
        const item = courses
          .flatMap((course: any) => course.assignments || [])
          .find((x: any) => x.id === assignmentId);
        if (item?.submission) setSubmission(item.submission);
      });
  }, [assignmentId, t]);
  if (!assignment) return null;
  const status = !submission || submission.needsRevision
    ? "К выполнению"
    : submission.score == null
      ? "На проверке"
      : "Выполнено";
  const send = async (e: any) => {
    e.preventDefault();
    let fileUrl = url;
    if (file) {
      const fd = new FormData(); fd.append("file", file);
      const upload = await fetch(api + `/assignments/${assignment.id}/submission/upload`, { method: "POST", headers: { Authorization: "Bearer " + t }, body: fd });
      if (!upload.ok) return say("Не удалось загрузить файл. Разрешены PDF, DOC и DOCX до 15 МБ.");
      fileUrl = (await upload.json()).url;
    }
    const r = await fetch(api + `/assignments/${assignment.id}/submission`, {
      method: "POST",
      headers: H(t),
      body: JSON.stringify({ textAnswer: text, fileUrl }),
    });
    if (r.ok) {
      setSubmission({ submittedAt: new Date().toISOString(), score: null, fileUrl });
      say("Работа отправлена преподавателю и перенесена в «На проверке».");
    } else say("Не удалось отправить работу. Заполните ответ и попробуйте снова.");
  };
  return (
    <section className="section assignmentPage">
      <button className="back" onClick={back}>← К домашним заданиям</button>
      <div className="assignmentIntro">
        <div><span>ДОМАШНЕЕ ЗАДАНИЕ · {d.title}</span><h1>{assignment.title}</h1></div>
        <aside><small>СТАТУС</small><b>{status}</b><small>ДЕДЛАЙН</small><strong>{new Date(assignment.dueDate).toLocaleDateString("ru-RU")}</strong></aside>
      </div>
      <div className="assignmentWorkGrid">
        <article className="taskBrief"><span>УСЛОВИЕ ЗАДАНИЯ</span><h2>Что нужно сделать</h2><p>{assignment.description}</p><div className="taskMeta">{assignment.module && <span><small>УРОК</small><b>{assignment.module}</b></span>}<span><small>МАКСИМАЛЬНАЯ ОЦЕНКА</small><b>{assignment.maxScore} баллов</b></span></div>{assignment.attachmentUrl && <a className="assignmentAttachment" href={assignment.attachmentUrl} target="_blank" rel="noreferrer">▤ {assignment.attachmentName || "Открыть файл задания"}</a>}</article>
        {(!submission || submission.needsRevision) ? <form className="submitWork" onSubmit={send}><span>ВАШ ОТВЕТ</span><h2>{submission?.needsRevision ? "Доработать и отправить снова" : "Отправить работу"}</h2>{submission?.needsRevision && <div className="revisionNotice"><b>Работа возвращена на доработку</b><p>{submission.teacherComment || "Преподаватель просит дополнить решение."}</p></div>}<textarea required value={text} onChange={(e) => setText(e.target.value)} placeholder="Опишите решение, приложите результат или краткий отчёт..."/><input disabled={!!file} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Ссылка на файл, Google Drive или репозиторий"/><label className="submissionFilePick">{file ? file.name : "Прикрепить готовую работу (PDF / Word)"}<input type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={e=>{setFile(e.target.files?.[0] || null); if(e.target.files?.[0]) setUrl("");}}/></label><button className="btn">{submission?.needsRevision ? "Отправить повторно →" : "Отправить на проверку →"}</button></form> : <article className="submissionState"><span>ВАША РАБОТА</span><h2>{submission.score == null ? "Работа на проверке" : "Оценка получена"}</h2>{submission.score == null ? <p>Преподаватель получил вашу работу и скоро оставит обратную связь.</p> : <><b>{submission.score} / {assignment.maxScore}</b><p>{submission.teacherComment || "Преподаватель пока не оставил комментарий."}</p></>}{submission.fileUrl && <a className="assignmentAttachment" href={submission.fileUrl} target="_blank" rel="noreferrer">▤ Открыть прикреплённую работу</a>}<button onClick={back}>Вернуться к списку ДЗ</button></article>}
      </div>
    </section>
  );
}
function ProfilePage({ user, token, back, logout, onUserChange }: any) {
  const [passwords, setPasswords] = useState({ current: "", next: "" });
  const [notice, setNotice] = useState("");
  const [avatar, setAvatar] = useState(user.avatarUrl || "");
  const role = user.role === "Teacher" ? "Преподаватель" : user.role === "Administrator" ? "Администратор" : "Студент";
  const updateAvatar = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 2 * 1024 * 1024) return setNotice("Выберите изображение до 2 МБ.");
    const reader = new FileReader();
    reader.onload = async () => {
      const avatarUrl = String(reader.result || "");
      const r = await fetch(api + "/auth/me", { method: "PUT", headers: H(token), body: JSON.stringify({ firstName: user.firstName, lastName: user.lastName, avatarUrl, bio: user.bio || "" }) });
      if (!r.ok) return setNotice("Не удалось сохранить фотографию.");
      const updated = await r.json();
      localStorage.setItem("user", JSON.stringify(updated));
      onUserChange(updated);
      setAvatar(updated.avatarUrl || avatarUrl);
      setNotice("Фотография профиля обновлена.");
    };
    reader.readAsDataURL(file);
  };
  const resetAvatar = async () => {
    if (!avatar) return;
    const r = await fetch(api + "/auth/me", { method: "PUT", headers: H(token), body: JSON.stringify({ firstName: user.firstName, lastName: user.lastName, avatarUrl: "", bio: user.bio || "" }) });
    if (!r.ok) return setNotice("Не удалось сбросить фотографию.");
    const updated = await r.json();
    localStorage.setItem("user", JSON.stringify(updated));
    onUserChange(updated);
    setAvatar("");
    setNotice("Фотография удалена. В профиле снова используются инициалы.");
  };
  return <section className="profilePage"><div className="profileWrap"><button className="back" onClick={back}>← Главная</button><div className="profileHero"><div className="avatarActions"><label className="profileAvatar avatarEditor" title="Изменить фотографию">{avatar ? <img src={avatar} alt="Фотография профиля" /> : <>{user.firstName?.[0]}{user.lastName?.[0]}</>}<input type="file" accept="image/*" onChange={e => updateAvatar(e.target.files?.[0])}/><b>Изменить</b></label>{avatar && <button className="resetAvatar" type="button" onClick={resetAvatar}>Сбросить фото</button>}</div><div><span>ПРОФИЛЬ УЧЁТНОЙ ЗАПИСИ</span><h1>{user.firstName} {user.lastName}</h1><p>{user.email} · {role}</p></div></div><div className="profileGrid"><section><h2>Безопасность</h2><p>Задайте личный пароль вместо временного. Его не увидят другие пользователи платформы.</p><form onSubmit={async(e)=>{e.preventDefault();const r=await fetch(api+"/auth/change-password",{method:"PUT",headers:H(token),body:JSON.stringify({currentPassword:passwords.current,newPassword:passwords.next})});setNotice(r.ok?"Пароль обновлён.":"Не удалось изменить пароль. Проверьте текущий пароль.");if(r.ok)setPasswords({current:"",next:""})}}><label>Текущий пароль<input required type="password" value={passwords.current} onChange={e=>setPasswords({...passwords,current:e.target.value})}/></label><label>Новый пароль<input required minLength={6} type="password" value={passwords.next} onChange={e=>setPasswords({...passwords,next:e.target.value})}/></label><button className="btn">Сохранить новый пароль</button>{notice&&<small>{notice}</small>}</form></section><section><h2>О профиле</h2><dl><div><dt>Роль</dt><dd>{role}</dd></div><div><dt>E-mail</dt><dd>{user.email}</dd></div><div><dt>Статус</dt><dd className="online">Активен</dd></div></dl><button className="logoutButton" type="button" onClick={logout}>Выйти из аккаунта</button></section></div></div></section>;
}
function CourseProgramPage({ user, token, say }: any) {
  const [data, setData] = useState<any>(null);
  const [courseId, setCourseId] = useState("");
  const [form, setForm] = useState({ title: "", description: "" });
  const load = () => fetch(api + (user.role === "Teacher" ? "/teacher/course-program" : "/student/course-program"), { headers: H(token) }).then(r=>r.ok?r.json():null).then((x)=>{setData(x); if(Array.isArray(x)&&!courseId&&x[0])setCourseId(String(x[0].id));});
  useEffect(()=>{load();},[]);
  const courses = Array.isArray(data) ? data : [];
  const course = user.role === "Teacher" ? courses.find((c:any)=>String(c.id)===courseId) : data;
  const addLesson = async(e:any) => { e.preventDefault(); const r=await fetch(api+`/teacher/courses/${courseId}/program-modules`,{method:"POST",headers:H(token),body:JSON.stringify({title:form.title,description:form.description,position:(course?.modules?.length||0)+1})}); if(!r.ok)return say("Не удалось добавить урок. Проверьте название: в курсе максимум 12 уроков."); setForm({title:"",description:""});say("Урок добавлен в программу.");load(); };
  const deleteLesson = async (id: number, title: string) => { if (!window.confirm(`Удалить урок «${title}»? Все материалы, домашние задания и сданные работы этого урока будут удалены.`)) return; const r = await fetch(api + `/teacher/modules/${id}`, { method: "DELETE", headers: H(token) }); if (!r.ok) return say("Не удалось удалить урок."); say("Урок, все его материалы и домашние задания удалены."); load(); };
  return <section className="programPage"><div className="programWrap"><span>ПРОГРАММА КУРСА</span><h1>{user.role === "Teacher" ? "Конструктор программы" : "Мой курс"}</h1><p>{user.role === "Teacher" ? "Соберите до 12 уроков: студент увидит их в последовательности обучения." : "Здесь собрана последовательность уроков текущего курса."}</p>{user.role === "Teacher" && <select className="programSelect" value={courseId} onChange={e=>setCourseId(e.target.value)}><option value="">Выберите курс</option>{courses.map((c:any)=><option value={c.id}>{c.title}</option>)}</select>}{course ? <><section className="programHero"><div><small>{user.role === "Teacher" ? "РЕДАКТИРУЕТСЯ" : "ТЕКУЩИЙ КУРС"}</small><h2>{course.title}</h2><p>{course.description}</p>{course.teacher && <b>Преподаватель: {course.teacher}</b>}</div><div><strong>{course.modules?.length || 0}<small> / 12 уроков</small></strong><span>в программе</span></div></section>{user.role === "Teacher" && <form className="lessonForm" onSubmit={addLesson}><h2>Добавить урок {((course.modules?.length || 0) + 1)} из 12</h2><input required disabled={(course.modules?.length || 0)>=12} placeholder="Название урока" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/><textarea disabled={(course.modules?.length || 0)>=12} placeholder="Коротко опишите, что изучит студент" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/><button className="btn" disabled={(course.modules?.length || 0)>=12}>{(course.modules?.length || 0)>=12 ? "Программа заполнена" : "Добавить урок"}</button></form>}<section className="lessonPlan">{course.modules?.length ? course.modules.map((m:any)=><article><i>{String(m.position || 0).padStart(2,"0")}</i><div><small>УРОК {m.position}</small><h2>{m.title}</h2><p>{m.description || "Описание урока будет добавлено преподавателем."}</p></div><span>{m.materials || 0} материалов</span>{user.role === "Teacher" && <button className="lessonDelete" onClick={()=>deleteLesson(m.id,m.title)}>Удалить урок</button>}</article>) : <div className="materialsEmpty"><i>▤</i><h2>Программа пока формируется</h2><p>{user.role === "Teacher" ? "Добавьте первый урок — он станет доступен студентам курса." : "Преподаватель скоро добавит темы и описание уроков."}</p></div>}</section></> : <div className="materialsEmpty"><i>▤</i><h2>{user.role === "Teacher" ? "Выберите курс" : "Курс ещё не назначен"}</h2><p>{user.role === "Teacher" ? "Выберите курс, чтобы сформировать программу обучения." : "После назначения здесь появится программа из уроков."}</p></div>}</div></section>;
}
function MaterialsPage({ user, token, say }: any) {
  const [data, setData] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({ courseId: "", moduleId: "", title: "", description: "", url: "", type: 0 });
  const load = () => fetch(api + (user.role === "Teacher" ? "/teacher/materials" : "/student/materials"), { headers: H(token) }).then(r => r.ok ? r.json() : null).then(setData);
  useEffect(() => { load(); }, []);
  const publish = async (e: any) => {
    e.preventDefault();
    let url = form.url, type = form.type;
    if (file) {
      const fd = new FormData(); fd.append("file", file);
      const upload = await fetch(api + "/teacher/materials/upload", { method: "POST", headers: { Authorization: "Bearer " + token }, body: fd });
      if (!upload.ok) return say("Не удалось загрузить файл. Разрешены PDF, DOC и DOCX до 15 МБ.");
      const uploaded = await upload.json(); url = uploaded.url; type = 2;
    }
    const r = await fetch(api + "/teacher/materials", { method: "POST", headers: H(token), body: JSON.stringify({ ...form, url, type, courseId: Number(form.courseId), moduleId: Number(form.moduleId) }) });
    if (!r.ok) return say("Заполните курс, урок, название и ссылку либо выберите файл.");
    setForm({ courseId: "", moduleId: "", title: "", description: "", url: "", type: 0 }); setFile(null); say("Материал опубликован для студентов курса."); load();
  };
  const courses = Array.isArray(data) ? data : [];
  const selectedCourse = courses.find((c: any) => String(c.id) === form.courseId);
  const course = user.role === "Teacher" ? null : data;
  return <section className="materialsPage"><div className="materialsWrap"><span>УЧЕБНЫЕ МАТЕРИАЛЫ</span><h1>{user.role === "Teacher" ? "Материалы курсов" : "Материалы моего курса"}</h1><p>{user.role === "Teacher" ? "Выберите созданный урок и прикрепите к нему ссылки, PDF или документы Word." : "Все материалы по текущему курсу собраны по урокам."}</p>{user.role === "Teacher" ? <><form className="materialForm" onSubmit={publish}><div className="materialFormHead"><h2>Добавить материал</h2><small>Файлы: PDF, DOC, DOCX · до 15 МБ</small></div><select required value={form.courseId} onChange={e=>setForm({...form,courseId:e.target.value,moduleId:""})}><option value="">Выберите курс</option>{courses.map((c:any)=><option value={c.id}>{c.title}</option>)}</select><select required disabled={!selectedCourse} value={form.moduleId} onChange={e=>setForm({...form,moduleId:e.target.value})}><option value="">{selectedCourse ? "Выберите урок из программы" : "Сначала выберите курс"}</option>{selectedCourse?.modules?.map((m:any)=><option value={m.id}>Урок {m.position || ""}: {m.title}</option>)}</select><input required placeholder="Название материала" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/><textarea placeholder="Кратко: что студент изучит" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/><div className="materialSource"><input disabled={!!file} type="url" placeholder="https:// ссылка на материал" value={form.url} onChange={e=>setForm({...form,url:e.target.value,type:0})}/><label className="filePick">{file ? file.name : "Выбрать PDF / Word"}<input type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={e=>{setFile(e.target.files?.[0] || null); if(e.target.files?.[0]) setForm({...form,url:""});}}/></label></div><button className="btn">Опубликовать материал</button></form><MaterialList courses={courses}/></> : course ? <><section className="materialCourseHero"><div><small>ТЕКУЩИЙ КУРС</small><h2>{course.title}</h2><p>{course.description}</p></div><b>Преподаватель: {course.teacher || "назначается"}</b></section><MaterialList courses={[course]}/></> : <div className="materialsEmpty"><i>▤</i><h2>Материалы появятся после назначения курса</h2><p>Администратор добавит вас в учебную группу — тогда здесь откроются уроки и документы преподавателя.</p></div>}</div></section>;
}
function MaterialList({ courses }: any) { const items = courses.flatMap((c:any)=> (c.modules || []).map((m:any)=>({...m,course:c.title}))); return <section className="materialList">{items.length ? items.map((m:any)=><article className="lessonMaterials"><div className="lessonTitle"><span>{m.course}</span><h2>{m.title}</h2>{m.description && <p>{m.description}</p>}</div>{m.materials.length ? <div className="materialItems">{m.materials.map((x:any)=><a href={x.url} target="_blank" rel="noreferrer"><i>{x.type === "Link" ? "↗" : "▤"}</i><div><b>{x.title}</b><small>{x.description || (x.type === "Link" ? "Открыть ссылку" : "Открыть документ")}</small></div><em>{x.type === "Link" ? "Открыть" : "Скачать"}</em></a>)}</div> : <p className="noLessonMaterials">В этом уроке пока нет материалов.</p>}</article>) : <div className="materialsEmpty"><i>▤</i><h2>Материалов пока нет</h2><p>Преподаватель добавит их сюда после подготовки урока.</p></div>}</section>; }
function Desk({ u, t, open, openAssignment, say, go, taskOnly = false }: any) {
  const [my, setMy] = useState<any[]>([]),
    [stats, setStats] = useState<any>(null),
    [users, setUsers] = useState<any[]>([]);
  useEffect(() => {
    fetch(api + "/my-courses", { headers: H(t) })
      .then((r) => {
        if (r.ok) return r.json();
        say(r.status === 401 ? "Сессия истекла. Войдите в аккаунт заново." : "Не удалось загрузить данные рабочего пространства.");
        return [];
      })
      .then((data) => setMy(Array.isArray(data) ? data : []));
    if (u.role === "Administrator") {
      fetch(api + "/admin/statistics", { headers: H(t) })
        .then((r) => {
          if (r.ok) return r.json();
          say(r.status === 401 ? "Сессия истекла. Войдите в аккаунт заново." : "Не удалось загрузить статистику администратора.");
          return null;
        })
        .then(setStats);
      fetch(api + "/admin/users", { headers: H(t) })
        .then((r) => {
          if (r.ok) return r.json();
          say(r.status === 401 ? "Сессия истекла. Войдите в аккаунт заново." : "Не удалось загрузить список пользователей.");
          return [];
        })
        .then(setUsers);
    }
  }, []);
  if (u.role === "Teacher")
    return <TeacherDesk courses={my} token={t} open={open} say={say} user={u} go={go} taskOnly={taskOnly} />;
  if (u.role === "Administrator")
    return (
      <section className="workspace">
        <div className="desk">
          <span>ПАНЕЛЬ АДМИНИСТРАТОРА</span>
          <h1>Платформа под контролем</h1>
          <div className="metric admin">
            <article>
              <small>ПОЛЬЗОВАТЕЛИ</small>
              <b>{stats?.users || "—"}</b>
              <em>{stats?.students || 0} студентов</em>
            </article>
            <article>
              <small>КУРСЫ</small>
              <b>{stats?.courses || "—"}</b>
              <em>{stats?.assignments || 0} заданий</em>
            </article>
            <article>
              <small>ПРЕПОДАВАТЕЛИ</small>
              <b>{stats?.teachers || "—"}</b>
              <em>Доступны для назначения</em>
            </article>
          </div>
          <AdminHub users={users} token={t} say={say} />
        </div>
      </section>
    );
  return <StudentDesk token={t} openAssignment={openAssignment} taskOnly={taskOnly} />;
}

function StudentDesk({ token, openAssignment, taskOnly = false }: any) {
  const [courses, setCourses] = useState<any[]>([]),
    [filter, setFilter] = useState<"todo" | "review" | "done">("todo"),
    [courseFilter, setCourseFilter] = useState("all"),
    [sort, setSort] = useState<"new" | "deadline">("new");
  useEffect(() => {
    fetch(api + "/student/dashboard", { headers: H(token) })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setCourses(Array.isArray(data) ? data : []));
  }, []);
  const assignments = courses.flatMap((c: any) =>
    c.assignments.map((a: any) => ({ ...a, course: c.title, courseId: c.id })),
  );
  const graded = assignments.filter((a: any) => a.submission?.score != null);
  const todo = assignments.filter((a: any) => !a.submission || a.submission.needsRevision), review = assignments.filter((a: any) => a.submission && a.submission.score == null && !a.submission.needsRevision), done = assignments.filter((a: any) => a.submission?.score != null);
  const current = (filter === "todo" ? todo : filter === "review" ? review : done)
    .filter((a: any) => courseFilter === "all" || String(a.courseId) === courseFilter)
    .sort((a: any, b: any) => sort === "new" ? new Date(b.createdAt || b.dueDate).getTime() - new Date(a.createdAt || a.dueDate).getTime() : new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  const average = graded.length ? (graded.reduce((sum:any,item:any)=>sum+item.submission.score,0)/graded.length).toFixed(1) : "—";
  const activeCourse = courses[0];
  return (
    <section className="studentPortal">
      <div className="studentContent">
        {!taskOnly ? <>
          <div className="portalHeader"><div><span>ЛИЧНЫЙ КАБИНЕТ</span><h1>Моё обучение</h1><p>Ваши оценки и текущие задания.</p></div></div>
          <div className="studentOverview"><div className="studentMetrics compact"><article className="violet"><small>К ВЫПОЛНЕНИЮ</small><b>{todo.length}</b><span>заданий ждут вас</span></article><article className="orange"><small>НА ПРОВЕРКЕ</small><b>{review.length}</b><span>ожидают оценку</span></article></div><section className="portalPanel averagePanel"><div className="panelTitle"><h2>Средний балл</h2><span>за всё время</span></div><div className="averageTiles"><article><b>{average}</b><small>Средний результат</small></article><article><b>{graded.length || "—"}</b><small>Оценок получено</small></article></div><div className="scoreChart"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></div><small className="chartHint">Динамика оценок по проверенным заданиям</small></section><section className="portalPanel marksPanel"><div className="panelTitle"><h2>Оценки</h2><span>{graded.length} результатов</span></div>{graded.length ? <div className="markGrid">{graded.map((a:any)=><button title={a.title}>{a.submission.score}</button>)}</div> : <p className="emptyMarks">Пока нет оценок — они появятся после проверки работ преподавателем.</p>}<small>Шкала оценки: от 1 до 10</small></section></div>
          {activeCourse && <section className="activeCourseState"><div className="activeCourseIntro"><span>ТЕКУЩИЙ КУРС</span><h2>{activeCourse.title}</h2><p>{activeCourse.description || "Описание курса скоро появится."}</p><small>Преподаватель: <b>{activeCourse.teacher || "назначается"}</b></small></div><div className="activeCourseStats"><article><i>▤</i><b>{activeCourse.materials}</b><span>материалов</span></article><article><i>✓</i><b>{activeCourse.completed} / {activeCourse.assignments.length}</b><span>заданий выполнено</span></article><article><i>→</i><b>{todo.length}</b><span>доступно к выполнению</span></article></div></section>}
          {courses.length === 0 && <section className="noCourseState"><div className="noCourseLead"><span>ОБУЧЕНИЕ НАЧИНАЕТСЯ ЗДЕСЬ</span><h2>Вам ещё не назначен курс</h2><p>Ваш аккаунт уже активен. Как только администратор добавит вас в учебную группу, здесь появятся материалы, задания и оценки.</p></div><div className="noCourseSteps"><article><i>01</i><b>Профиль готов</b><p>Учётная запись создана — при желании добавьте фотографию и смените временный пароль.</p></article><article><i>02</i><b>Ожидайте назначения</b><p>Администратор запишет вас на курс и закрепит преподавателя за вашей группой.</p></article><article><i>03</i><b>Начните обучение</b><p>После назначения откроются учебные материалы и домашние задания.</p></article></div></section>}
        </> : <><div className="homeworkTop"><div><span>ДОМАШНИЕ ЗАДАНИЯ</span><h1>Мои задания</h1><p>Откройте карточку, чтобы прочитать условие и отправить работу.</p></div><b>Всего: {assignments.length}</b></div><div className="homeworkTabs"><button className={filter==="todo"?"active":""} onClick={()=>setFilter("todo")}>К выполнению <b>{todo.length}</b></button><button className={filter==="review"?"active":""} onClick={()=>setFilter("review")}>На проверке <b>{review.length}</b></button><button className={filter==="done"?"active":""} onClick={()=>setFilter("done")}>Выполнены <b>{done.length}</b></button></div><div className="homeworkFilters"><label>Курс<select value={courseFilter} onChange={e=>setCourseFilter(e.target.value)}><option value="all">Все курсы</option>{courses.map((c:any)=><option value={c.id}>{c.title}</option>)}</select></label><label>Сортировка<select value={sort} onChange={e=>setSort(e.target.value as "new"|"deadline")}><option value="new">Сначала новые</option><option value="deadline">Ближайший дедлайн</option></select></label></div><section className={current.length ? "taskCards" : "taskCards taskCardsEmpty"}>{current.length ? current.map((a:any)=><article className={"taskCard "+filter}><i>✦</i><div><small>{a.course}</small><b>{a.title}</b><p>{filter==="done"?`Оценка: ${a.submission.score} из 10`:filter==="review"?"Работа отправлена преподавателю":`Дедлайн: ${deadlineText(a.dueDate)}`}</p></div><button onClick={()=>openAssignment(a.courseId,a.id)}>{filter==="todo"?"Открыть задание →":"Подробнее →"}</button></article>) : <div className="taskEmpty"><i>{filter === "done" ? "✓" : filter === "review" ? "◌" : "✦"}</i><h2>{filter === "done" ? "Пока нет выполненных заданий" : filter === "review" ? "Работ на проверке нет" : "Все задания выполнены"}</h2><p>{filter === "todo" ? "Новые задания от преподавателя появятся здесь." : filter === "review" ? "Отправленные работы появятся здесь до выставления оценки." : "После проверки преподавателем здесь появятся ваши результаты."}</p></div>}</section></>}
      </div>
    </section>
  );
}

function TeacherDesk({ courses, token, open, say, user, go, taskOnly = false }: any) {
  const [works, setWorks] = useState<any[]>([]),
    [published, setPublished] = useState<any[]>([]),
    [teacherTab, setTeacherTab] = useState<"publish" | "review" | "checked">("publish"),
    [draft, setDraft] = useState<
      Record<number, { score: string; comment: string }>
    >({}),
    [assignmentFile, setAssignmentFile] = useState<File | null>(null),
    [assignment, setAssignment] = useState({
      courseId: "",
      moduleId: "",
      title: "",
      description: "",
      daysToComplete: "",
    });
  const load = () =>
    fetch(api + "/teacher/submissions", { headers: H(token) })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setWorks(Array.isArray(data) ? data : []));
  const loadPublished = () =>
    fetch(api + "/teacher/assignments", { headers: H(token) })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setPublished(Array.isArray(data) ? data : []));
  useEffect(() => {
    load();
    loadPublished();
  }, []);
  const pendingWorks = works.filter((work: any) => (work.score === null || work.score === undefined) && !work.needsRevision);
  const checkedWorks = works.filter((work: any) => work.score !== null && work.score !== undefined);
  return (
    <section className="workspace">
      <div className={"desk " + (taskOnly ? "taskDesk" : "")}>
        <span>{taskOnly ? "ЗАДАНИЯ ПРЕПОДАВАТЕЛЯ" : "КАБИНЕТ ПРЕПОДАВАТЕЛЯ"}</span>
        <h1 className="teacherTitle">{taskOnly ? "Домашние задания" : "Панель преподавателя"}</h1>
        <p className="teacherIdentity">Вы вошли как <b>{user.firstName} {user.lastName}</b>. Публикуйте задания только для назначенных вам групп.</p>
        {!taskOnly && <>
          <section className="teacherWelcome">
            <div><small>ОБЗОР НА СЕГОДНЯ</small><h2>В фокусе — ваши группы и обратная связь</h2><p>{pendingWorks.length ? `На проверке ${pendingWorks.length} ${pendingWorks.length === 1 ? "работа" : "работ"}: студенты ждут вашу оценку.` : "Новых работ на проверке нет. Можно подготовить следующий урок или задание."}</p></div>
            <button className="btn" onClick={() => go("tasks")}>{pendingWorks.length ? "Перейти к проверке →" : "Создать задание →"}</button>
          </section>
          <div className="teacherOverview">
            <section className="teacherKeyMetrics">
              <article><i>▣</i><div><small>КУРСЫ</small><b>{courses.length}</b><span>закреплено за вами</span></div></article>
              <article><i>◉</i><div><small>СТУДЕНТЫ</small><b>{courses.reduce((total: number, course: any) => total + (course.students?.length || 0), 0)}</b><span>во всех группах</span></div></article>
              <article className={pendingWorks.length ? "attention" : ""}><i>✓</i><div><small>НА ПРОВЕРКЕ</small><b>{pendingWorks.length}</b><span>{pendingWorks.length ? "нужна ваша оценка" : "всё проверено"}</span></div></article>
            </section>
            <section className="teacherActions"><h2>Быстрые действия</h2><button onClick={() => go("tasks")}><i>＋</i><span><b>Домашние задания</b><small>Опубликовать или проверить</small></span><em>→</em></button><button onClick={() => go("materials")}><i>▤</i><span><b>Учебные материалы</b><small>Добавить файл или ссылку</small></span><em>→</em></button><button onClick={() => go("program")}><i>☰</i><span><b>Программа курса</b><small>Создать и настроить уроки</small></span><em>→</em></button></section>
          </div>
        </>}
        {taskOnly && <div className="teacherTaskTabs">
          <button className={teacherTab === "publish" ? "active" : ""} onClick={() => setTeacherTab("publish")}>Публикация ДЗ <b>{published.length}</b></button>
          <button className={teacherTab === "review" ? "active" : ""} onClick={() => setTeacherTab("review")}>На проверке <b>{pendingWorks.length}</b></button>
          <button className={teacherTab === "checked" ? "active" : ""} onClick={() => setTeacherTab("checked")}>Проверены <b>{checkedWorks.length}</b></button>
        </div>}
        {taskOnly && teacherTab === "publish" && <form
          className="assignmentCreate"
          onSubmit={async (e) => {
            e.preventDefault();
            let attachmentUrl: string | null = null, attachmentName: string | null = null;
            if (assignmentFile) {
              const fd = new FormData(); fd.append("file", assignmentFile);
              const upload = await fetch(api + "/teacher/materials/upload", { method: "POST", headers: { Authorization: "Bearer " + token }, body: fd });
              if (!upload.ok) return say("Не удалось загрузить файл задания. Разрешены PDF, DOC и DOCX до 15 МБ.");
              const uploaded = await upload.json(); attachmentUrl = uploaded.url; attachmentName = uploaded.fileName;
            }
            const r = await fetch(
              api + `/courses/${assignment.courseId}/assignments`,
              {
                method: "POST",
                headers: H(token),
                body: JSON.stringify({
                  ...assignment,
                  courseId: undefined,
                  moduleId: Number(assignment.moduleId),
                  daysToComplete: Number(assignment.daysToComplete),
                  attachmentUrl,
                  attachmentName,
                }),
              },
            );
            say(
              r.ok
                ? "Домашнее задание опубликовано для студентов курса."
                : "Заполните все поля задания.",
            );
            if (r.ok) {
              setAssignment({
                courseId: "",
                moduleId: "",
                title: "",
                description: "",
                daysToComplete: "",
              });
              setAssignmentFile(null);
              loadPublished();
            }
          }}
        >
          <div>
            <span>НОВОЕ ДОМАШНЕЕ ЗАДАНИЕ</span>
            <h2>Поставить задание студентам</h2>
          </div>
          <div className="assignmentCourseRow">
            <label className="fieldLabel">Курс
              <select
                required
                value={assignment.courseId}
                onChange={(e) =>
                  setAssignment({ ...assignment, courseId: e.target.value, moduleId: "" })
                }
              >
                <option value="">Выберите курс</option>
                {courses.map((c: any) => (
                  <option value={c.id}>{c.title} — группа: {c.students?.length || 0} студентов</option>
                ))}
              </select>
            </label>
            <label className="fieldLabel">Урок
              <select required disabled={!assignment.courseId} value={assignment.moduleId} onChange={(e) => setAssignment({ ...assignment, moduleId: e.target.value })}>
                <option value="">{assignment.courseId ? "Выберите урок из программы" : "Сначала выберите курс"}</option>
                {courses.find((c:any) => String(c.id) === assignment.courseId)?.modules?.map((m:any) => <option value={m.id}>Урок {m.position}: {m.title}</option>)}
              </select>
            </label>
          </div>
          {assignment.courseId && <div className="selectedGroup"><b>Задание получат:</b> {courses.find((c:any) => String(c.id) === assignment.courseId)?.students?.length ? courses.find((c:any) => String(c.id) === assignment.courseId).students.map((s:any) => s.name).join(", ") : "в группе пока нет студентов"}</div>}
          <div className="assignmentDetailsRow">
            <label className="fieldLabel">Название задания
              <input
                required
                placeholder="Например: анализ пользовательского сценария"
                value={assignment.title}
                onChange={(e) =>
                  setAssignment({ ...assignment, title: e.target.value })
                }
              />
            </label>
            <label className="fieldLabel">Описание и критерии выполнения
              <textarea
                required
                placeholder="Опишите результат, требования к работе и критерии проверки"
                value={assignment.description}
                onChange={(e) =>
                  setAssignment({ ...assignment, description: e.target.value })
                }
              />
            </label>
          </div>
          <div className="assignmentOptionsRow">
            <label className="fieldLabel assignmentDeadline">Срок выполнения
              <span>От 1 до 10 дней после публикации</span>
              <input required type="number" min="1" max="10" placeholder="Например, 7" value={assignment.daysToComplete} onChange={(e) => setAssignment({ ...assignment, daysToComplete: e.target.value })}/>
            </label>
            <div className="scoreLimit"><small>МАКСИМАЛЬНАЯ ОЦЕНКА</small><b>10 баллов</b><span>единая шкала оценки</span></div>
            <label className="assignmentFilePick">{assignmentFile ? assignmentFile.name : "Прикрепить файл (PDF / Word)"}<input type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={e => setAssignmentFile(e.target.files?.[0] || null)}/></label>
          </div>
          <button className="btn">Опубликовать задание</button>
        </form>}
        {taskOnly && <div className={"teacherLayout teacherTab-" + teacherTab}>
          <section>
            <h2>{teacherTab === "review" ? "Работы на проверке" : "Проверенные работы"}</h2>
            {(teacherTab === "review" ? pendingWorks : checkedWorks).length ? (
              (teacherTab === "review" ? pendingWorks : checkedWorks).map((w) => {
                const d = draft[w.id] || { score: "", comment: "" };
                return (
                  <article className={"work reviewWork " + (teacherTab === "review" ? "isPending" : "isChecked")}>
                    <div className="workHead"><div><small>{w.course}</small><b>{w.assignment}</b></div><span>{w.student}</span></div>
                    <div className="workAnswer"><small>ОТВЕТ СТУДЕНТА</small><p>{w.textAnswer || "Студент прикрепил работу без текстового комментария."}</p></div>
                    {w.fileUrl && (
                      <a href={w.fileUrl} target="_blank">
                        Открыть ссылку на работу ↗
                      </a>
                    )}
                    {teacherTab === "review" ? <div className="reviewControls">
                      <input
                        type="number"
                        min="1"
                        max="10"
                        placeholder="Оценка от 1 до 10"
                        value={d.score}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            [w.id]: { ...d, score: e.target.value },
                          })
                        }
                      />
                      <input
                        placeholder="Комментарий студенту"
                        value={d.comment}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            [w.id]: { ...d, comment: e.target.value },
                          })
                        }
                      />
                      <button
                        type="button"
                        className="btn"
                        onClick={async () => {
                          const score = Number(d.score);
                          const comment = d.comment.trim();
                          if (!Number.isInteger(score) || score < 1 || score > 10 || !comment) return say("Укажите оценку от 1 до 10 и комментарий студенту.");
                          const r = await fetch(
                            api + `/submissions/${w.id}/grade`,
                            {
                              method: "PUT",
                              headers: H(token),
                              body: JSON.stringify({
                                score,
                                comment,
                              }),
                            },
                          );
                          const result = r.ok ? null : await r.json().catch(() => null);
                          say(r.ok ? "Оценка сохранена. Работа перенесена в «Проверены»." : (result?.message || "Не удалось сохранить оценку. Попробуйте ещё раз."));
                          if (r.ok) {
                            load();
                            setTeacherTab("checked");
                          }
                        }}
                      >
                        Оценить
                      </button>
                      <button type="button" className="returnWork" onClick={async () => {
                        const comment = d.comment.trim();
                        if (!comment) return say("Напишите комментарий: студент увидит его вместе с запросом на доработку.");
                        const r = await fetch(api + `/submissions/${w.id}/return`, { method: "PUT", headers: H(token), body: JSON.stringify({ comment }) });
                        const result = r.ok ? null : await r.json().catch(() => null);
                        say(r.ok ? "Работа возвращена студенту на доработку." : (result?.message || "Не удалось вернуть работу на доработку."));
                        if (r.ok) { load(); setDraft({ ...draft, [w.id]: { score: "", comment: "" } }); }
                      }}>Вернуть на доработку</button>
                    </div> : <div className="gradedWork"><b>Оценка: {w.score} / 10</b><p>{w.teacherComment || "Комментарий не добавлен."}</p></div>}
                  </article>
                );
              })
            ) : (
              <div className="teacherEmpty"><i>{teacherTab === "review" ? "◌" : "✓"}</i><h3>{teacherTab === "review" ? "Работ на проверке нет" : "Проверенных работ пока нет"}</h3><p>{teacherTab === "review" ? "Когда студент отправит ответ, работа появится здесь для проверки." : "После выставления оценки работы будут храниться здесь."}</p></div>
            )}
          </section>
          <section>
            <h2>Опубликованные задания</h2>
            {published.length ? published.map((item) => (
              <article className="publishedAssignment">
                <div><b>{item.title}</b><small>{item.course} · дедлайн: {deadlineText(item.dueDate)} · сдано: {item.submitted}</small></div>
                <button onClick={async () => { if (!window.confirm(`Отозвать задание «${item.title}»? Все ${item.submitted} сданных работ будут удалены.`)) return; const r=await fetch(api+`/assignments/${item.id}`,{method:"DELETE",headers:H(token)}); say(r.ok?"Задание и связанные с ним работы отозваны.":"Не удалось отозвать задание."); if(r.ok){loadPublished();load();} }}>Отозвать ДЗ</button>
              </article>
            )) : <div className="teacherEmpty"><i>＋</i><h3>Опубликованных заданий пока нет</h3><p>Создайте первое домашнее задание — оно сразу станет доступно студентам выбранной группы.</p></div>}
          </section>
        </div>}
        {!taskOnly && <section className="teacherGroups">
          <div className="teacherGroupsHead"><div><span>МОИ ГРУППЫ</span><h2>Курсы и студенты</h2><p>Состав групп и учебная активность по закреплённым за вами курсам.</p></div><button onClick={() => go("program")}>Управлять программой →</button></div>
          {courses.length ? <div className="teacherGroupGrid">{courses.map((c: any) => {
            const courseAssignments = published.filter((item: any) => item.course === c.title);
            return <article className="teacherGroupCard"><div className="teacherGroupCardHead"><div><small>{c.category?.name || "УЧЕБНАЯ ГРУППА"}</small><h3>{c.title}</h3></div><span>{c.modules?.length || 0} / 12 уроков</span></div><p>{c.description || "Описание курса добавит администратор."}</p><div className="teacherGroupStats"><span><b>{c.students?.length || 0}</b> студентов</span><span><b>{courseAssignments.length}</b> ДЗ опубликовано</span></div><div className="teacherStudents">{c.students?.length ? c.students.slice(0, 4).map((s:any) => <span title={s.name}>{s.name}</span>) : <small>В группу ещё не записаны студенты</small>}</div><button onClick={() => open(c.id)}>Открыть курс →</button></article>;
          })}</div> : <div className="teacherNoGroups"><i>◌</i><h2>Курсы пока не назначены</h2><p>Когда администратор закрепит за вами группу, здесь появится состав студентов и инструменты курса.</p></div>}
        </section>}
      </div>
    </section>
  );
}

function AdminHub({ users, token, say }: any) {
  const [tab, setTab] = useState<"overview" | "courses" | "students" | "teachers">("overview");
  const [people, setPeople] = useState<any[]>(users), [courses, setCourses] = useState<any[]>([]), [roster, setRoster] = useState<any[]>([]), [activity, setActivity] = useState<any[]>([]), [search, setSearch] = useState("");
  const [teacher, setTeacher] = useState({ firstName:"", lastName:"", email:"", password:"" });
  const [teacherCourseId, setTeacherCourseId] = useState(""), [teacherId, setTeacherId] = useState(""), [studentCourseId, setStudentCourseId] = useState(""), [studentId, setStudentId] = useState("");
  const load = () => { fetch(api+"/admin/users",{headers:H(token)}).then(r=>r.ok?r.json():[]).then(setPeople); fetch(api+"/courses?pageSize=100").then(r=>r.json()).then(x=>setCourses(x.items||[])); fetch(api+"/admin/courses-roster",{headers:H(token)}).then(r=>r.ok?r.json():[]).then(setRoster); fetch(api+"/admin/activity",{headers:H(token)}).then(r=>r.ok?r.json():[]).then(setActivity); };
  useEffect(() => { setPeople(users); load(); }, []);
  const students = people.filter(x=>x.role === "Student"), teachers = people.filter(x=>x.role === "Teacher");
  const activeRoster = roster.filter(c=>c.teacher).length, withoutTeacher = roster.filter(c=>!c.teacher), withoutStudents = roster.filter(c=>!c.students.length);
  const visible = (role:string) => people.filter(x=>x.role===role && `${x.firstName} ${x.lastName} ${x.email}`.toLowerCase().includes(search.toLowerCase()));
  const resetPassword = async (x:any) => { const password=window.prompt(`Новый временный пароль для ${x.firstName} ${x.lastName} (минимум 6 символов):`); if(!password)return; if(password.length<6)return say("Пароль должен содержать минимум 6 символов."); const r=await fetch(api+`/admin/users/${x.id}/password`,{method:"PUT",headers:H(token),body:JSON.stringify({newPassword:password})}); say(r.ok?`Временный пароль задан. Передайте его ${x.role==="Teacher"?"преподавателю":"студенту"} безопасным способом.`:"Не удалось изменить пароль."); };
  const block = async (x:any) => { if(!window.confirm(`${x.isBlocked?"Разблокировать":"Заблокировать"} пользователя ${x.firstName} ${x.lastName}?`))return; const r=await fetch(api+`/admin/users/${x.id}/block`,{method:"PUT",headers:H(token)}); if(r.ok){say(x.isBlocked?"Пользователь разблокирован.":"Пользователь заблокирован.");load();} };
  const assignTeacher = async () => { if(!teacherCourseId||!teacherId)return say("Выберите курс и преподавателя."); const r=await fetch(api+`/admin/courses/${teacherCourseId}/teacher/${teacherId}`,{method:"PUT",headers:H(token)}); say(r.ok?"Преподаватель назначен на курс.":"Не удалось назначить преподавателя."); if(r.ok)load(); };
  const enroll = async () => { if(!studentId||!studentCourseId)return say("Выберите студента и курс."); const r=await fetch(api+"/admin/enrollments",{method:"POST",headers:H(token),body:JSON.stringify({studentId,courseId:Number(studentCourseId)})}); say(r.ok?"Студент записан на курс.":"У студента уже есть активный курс или данные неверны.");if(r.ok)load(); };
  return <section className="adminHub"><div className="adminTabs"><button className={tab==="overview"?"active":""} onClick={()=>setTab("overview")}>Обзор</button><button className={tab==="courses"?"active":""} onClick={()=>setTab("courses")}>Курсы и группы <b>{roster.length}</b></button><button className={tab==="students"?"active":""} onClick={()=>setTab("students")}>Студенты <b>{students.length}</b></button><button className={tab==="teachers"?"active":""} onClick={()=>setTab("teachers")}>Преподаватели <b>{teachers.length}</b></button></div>
    {tab==="overview" && <div className="adminOverview"><section className="adminAttention"><div><span>ТРЕБУЕТ ВНИМАНИЯ</span><h2>Проверьте учебный процесс</h2><p>Быстрые действия для незавершённых назначений и пустых групп.</p></div><div className="attentionList"><button onClick={()=>setTab("courses")}><b>{withoutTeacher.length}</b><span>курсов без преподавателя</span><em>→</em></button><button onClick={()=>setTab("courses")}><b>{withoutStudents.length}</b><span>групп без студентов</span><em>→</em></button><button onClick={()=>setTab("students")}><b>{students.filter(s=>!roster.some(c=>c.students.some((x:any)=>x.id===s.id))).length}</b><span>студентов без активного курса</span><em>→</em></button></div></section><div className="adminOverviewGrid"><section className="adminQuick"><h2>Быстрые действия</h2><button onClick={()=>setTab("teachers")}><i>＋</i><span><b>Создать преподавателя</b><small>Новая учётная запись и временный пароль</small></span><em>→</em></button><button onClick={()=>setTab("courses")}><i>↗</i><span><b>Назначить преподавателя</b><small>Закрепить за курсом одну учебную группу</small></span><em>→</em></button><button onClick={()=>setTab("students")}><i>◉</i><span><b>Записать студента</b><small>Добавить на следующий доступный курс</small></span><em>→</em></button></section><section className="adminPulse"><span>СОСТОЯНИЕ ПЛАТФОРМЫ</span><h2>{activeRoster} из {roster.length} курсов укомплектовано</h2><div><b>{students.length}</b><small>студентов</small><b>{teachers.length}</b><small>преподавателей</small><b>{courses.length}</b><small>программ</small></div><p>Следите за назначениями, чтобы у каждого курса был преподаватель, а у студентов — учебная траектория.</p></section></div><section className="adminLog"><div><span>ЖУРНАЛ СОБЫТИЙ</span><h2>Последние действия в системе</h2></div>{activity.length?<div>{activity.slice(0,6).map(x=><article><i>●</i><p><b>{x.action}</b><small>{x.details} · {x.actor}</small></p><time>{new Date(x.createdAt).toLocaleString("ru-RU",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"})}</time></article>)}</div>:<p>Пока нет действий, которые нужно отразить в журнале.</p>}</section></div>}
    {tab==="courses" && <div className="adminSection"><div className="adminSectionHead"><div><span>КУРСЫ И ГРУППЫ</span><h2>Состав и назначения</h2><p>Один курс — один преподаватель. Здесь видно, кто ведёт группу и кто в ней учится.</p></div></div><div className="adminInlineActions"><section><h3>Назначить преподавателя</h3><select value={teacherCourseId} onChange={e=>setTeacherCourseId(e.target.value)}><option value="">Выберите курс</option>{courses.map(c=><option value={c.id}>{c.title}</option>)}</select><select value={teacherId} onChange={e=>setTeacherId(e.target.value)}><option value="">Выберите преподавателя</option>{teachers.map(x=><option value={x.id}>{x.firstName} {x.lastName}</option>)}</select><button className="btn" onClick={assignTeacher}>Сохранить назначение</button></section><section><h3>Записать студента</h3><select value={studentId} onChange={e=>setStudentId(e.target.value)}><option value="">Выберите студента</option>{students.map(x=><option value={x.id}>{x.firstName} {x.lastName}</option>)}</select><select value={studentCourseId} onChange={e=>setStudentCourseId(e.target.value)}><option value="">Выберите курс</option>{courses.map(c=><option value={c.id}>{c.title}</option>)}</select><button className="btn" onClick={enroll}>Записать на курс</button></section></div><div className="adminCourseGrid">{roster.map(c=><article className="adminCourseCard"><div><small>УЧЕБНАЯ ГРУППА</small><h3>{c.title}</h3><p>{c.description}</p></div><div className="adminCourseMetrics"><span><b>{c.modules}</b> уроков</span><span><b>{c.materials}</b> материалов</span><span><b>{c.assignments}</b> ДЗ</span></div><div className="adminCourseLead"><span>Преподаватель</span><b>{c.teacher?.name || "Не назначен"}</b></div><div className="adminStudentList"><small>СТУДЕНТЫ · {c.students.length}</small>{c.students.length?c.students.map((s:any)=><div><span>{s.name}<small>{s.email}</small></span><button onClick={async()=>{if(!window.confirm(`Снять ${s.name} с курса «${c.title}»?`))return;const r=await fetch(api+`/admin/enrollments/${c.id}/${s.id}`,{method:"DELETE",headers:H(token)});if(r.ok){say("Студент снят с курса.");load();}}}>Снять</button></div>):<p>В группу пока никто не записан.</p>}</div></article>)}</div></div>}
    {(tab==="students"||tab==="teachers") && <div className="adminSection"><div className="adminSectionHead"><div><span>{tab==="students"?"СТУДЕНТЫ":"ПРЕПОДАВАТЕЛИ"}</span><h2>{tab==="students"?"Учётные записи и обучение":"Команда преподавателей"}</h2><p>{tab==="students"?"Записывайте студентов на курсы, управляйте доступом и временными паролями.":"Создавайте преподавателей, назначайте курсы и управляйте доступом."}</p></div>{tab==="teachers"&&<button className="btn" onClick={()=>document.getElementById("teacher-create")?.scrollIntoView({behavior:"smooth"})}>Создать преподавателя</button>}</div>{tab==="teachers"&&<form id="teacher-create" className="teacherCreateCompact" onSubmit={async e=>{e.preventDefault();const r=await fetch(api+"/admin/teachers",{method:"POST",headers:H(token),body:JSON.stringify(teacher)});if(r.ok){say("Преподаватель создан.");setTeacher({firstName:"",lastName:"",email:"",password:""});load();}else say("Проверьте введённые данные.");}}><input required placeholder="Имя" value={teacher.firstName} onChange={e=>setTeacher({...teacher,firstName:e.target.value})}/><input required placeholder="Фамилия" value={teacher.lastName} onChange={e=>setTeacher({...teacher,lastName:e.target.value})}/><input required type="email" placeholder="E-mail" value={teacher.email} onChange={e=>setTeacher({...teacher,email:e.target.value})}/><input required minLength={6} type="password" placeholder="Временный пароль" value={teacher.password} onChange={e=>setTeacher({...teacher,password:e.target.value})}/><button className="btn">Создать</button></form>}<div className="adminPeopleTools"><input placeholder="Поиск по имени или e-mail" value={search} onChange={e=>setSearch(e.target.value)}/><span>Найдено: {visible(tab==="students"?"Student":"Teacher").length}</span></div><div className="adminPeopleList">{visible(tab==="students"?"Student":"Teacher").map(x=>{const assigned=tab==="students"?roster.find(c=>c.students.some((s:any)=>s.id===x.id)):roster.filter(c=>c.teacher?.id===x.id);return <article><i>{x.firstName?.[0]}{x.lastName?.[0]}</i><div><b>{x.firstName} {x.lastName}</b><small>{x.email}</small>{tab==="students"?<em>{assigned?`Текущий курс: ${assigned.title}`:"Курс не назначен"}</em>:<em>{assigned.length?`Курсы: ${assigned.map((c:any)=>c.title).join(", ")}`:"Курсы не назначены"}</em>}</div><span className={x.isBlocked?"blocked":""}>{x.isBlocked?"Заблокирован":"Активен"}</span><button onClick={()=>resetPassword(x)}>Сбросить пароль</button><button className="danger" onClick={()=>block(x)}>{x.isBlocked?"Разблокировать":"Блокировать"}</button></article>})}</div></div>}
  </section>;
}

export function AdminControls({ users, token, say }: any) {
  const [courses, setCourses] = useState<any[]>([]),
    [teacher, setTeacher] = useState({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    }),
    [studentId, setStudentId] = useState(""),
    [teacherCourseId, setTeacherCourseId] = useState(""),
    [studentCourseId, setStudentCourseId] = useState(""),
    [teacherId, setTeacherId] = useState("");
  const refreshCourses = () =>
    fetch(api + "/courses?pageSize=100")
      .then((r) => r.json())
      .then((x) => setCourses(x.items || []));
  useEffect(() => {
    refreshCourses();
  }, []);
  const students = users.filter((x: any) => x.role === "Student"),
    teachers = users.filter((x: any) => x.role === "Teacher");
  return (
    <section className="adminActions">
      <div className="adminCard">
        <span>01 · ПРЕПОДАВАТЕЛИ</span>
        <h3>Создать преподавателя</h3>
        <p>После создания назначьте ему курс ниже.</p>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const r = await fetch(api + "/admin/teachers", {
              method: "POST",
              headers: H(token),
              body: JSON.stringify(teacher),
            });
            say(
              r.ok
                ? "Преподаватель создан. Обновите кабинет, чтобы увидеть его в списке."
                : "Проверьте введённые данные.",
            );
          }}
        >
          <div className="split">
            <input
              required
              placeholder="Имя"
              onChange={(e) =>
                setTeacher({ ...teacher, firstName: e.target.value })
              }
            />
            <input
              required
              placeholder="Фамилия"
              onChange={(e) =>
                setTeacher({ ...teacher, lastName: e.target.value })
              }
            />
          </div>
          <input
            required
            type="email"
            placeholder="E-mail преподавателя"
            onChange={(e) => setTeacher({ ...teacher, email: e.target.value })}
          />
          <input
            required
            minLength={6}
            type="password"
            placeholder="Пароль (минимум 6 символов)"
            onChange={(e) =>
              setTeacher({ ...teacher, password: e.target.value })
            }
          />
          <button className="btn">Создать преподавателя</button>
        </form>
      </div>
      <div className="adminCard">
        <span>02 · КУРАТОР КУРСА</span>
        <h3>Назначить преподавателя</h3>
        <p>Выберите курс и преподавателя, который будет его вести.</p>
        <select
          value={teacherCourseId}
          onChange={(e) => setTeacherCourseId(e.target.value)}
        >
          <option value="">Выберите курс</option>
          {courses.map((c: any) => (
            <option value={c.id}>{c.title}</option>
          ))}
        </select>
        <select
          value={teacherId}
          onChange={(e) => setTeacherId(e.target.value)}
        >
          <option value="">Выберите преподавателя</option>
          {teachers.map((x: any) => (
            <option value={x.id}>
              {x.firstName} {x.lastName}
            </option>
          ))}
        </select>
        <button
          className="btn"
          onClick={async () => {
            if (!teacherCourseId || !teacherId)
              return say("Выберите курс и преподавателя.");
            const r = await fetch(
              api + `/admin/courses/${teacherCourseId}/teacher/${teacherId}`,
              { method: "PUT", headers: H(token) },
            );
            say(
              r.ok
                ? "Преподаватель назначен на курс."
                : "Не удалось назначить преподавателя.",
            );
          }}
        >
          Назначить на курс
        </button>
      </div>
      <div className="adminCard">
        <span>03 · ОТДЕЛ ПРОДАЖ</span>
        <h3>Записать студента</h3>
        <p>Студент увидит курс в личном кабинете сразу после назначения.</p>
        <select
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        >
          <option value="">Выберите студента</option>
          {students.map((x: any) => (
            <option value={x.id}>
              {x.firstName} {x.lastName}
            </option>
          ))}
        </select>
        <select
          value={studentCourseId}
          onChange={(e) => setStudentCourseId(e.target.value)}
        >
          <option value="">Выберите курс</option>
          {courses.map((c: any) => (
            <option value={c.id}>{c.title}</option>
          ))}
        </select>
        <button
          className="btn"
          onClick={async () => {
            if (!studentId || !studentCourseId)
              return say("Выберите студента и курс.");
            const r = await fetch(api + "/admin/enrollments", {
              method: "POST",
              headers: H(token),
              body: JSON.stringify({
                studentId,
                courseId: Number(studentCourseId),
              }),
            });
            say(
              r.ok
                ? "Студент записан на курс."
                : "Студент уже записан или данные неверны.",
            );
          }}
        >
          Записать на курс
        </button>
      </div>
    </section>
  );
}

export function AdminRoster({ token, say }: any) {
  const [rows, setRows] = useState<any[]>([]);
  const load = () =>
    fetch(api + "/admin/courses-roster", { headers: H(token) })
      .then((r) => r.json())
      .then(setRows);
  useEffect(() => {
    load();
  }, []);
  return (
    <section className="roster">
      <div className="rosterHead">
        <div>
          <span>НАЗНАЧЕНИЯ</span>
          <h2>Курсы, преподаватели и студенты</h2>
        </div>
        <button onClick={load}>Обновить</button>
      </div>
      {rows.map((c) => (
        <article>
          <div className="rosterCourse">
            <b>{c.title}</b>
            <small>Преподаватель</small>
            <strong>{c.teacher?.name || "Не назначен"}</strong>
          </div>
          <div className="rosterStudents">
            <small>ЗАПИСАННЫЕ СТУДЕНТЫ · {c.students.length}</small>
            {c.students.length ? (
              c.students.map((s: any) => (
                <div>
                  <span>
                    {s.name}
                    <small>{s.email}</small>
                  </span>
                  <button
                    onClick={async () => {
                      const r = await fetch(
                        api + `/admin/enrollments/${c.id}/${s.id}`,
                        { method: "DELETE", headers: H(token) },
                      );
                      if (r.ok) {
                        say("Студент снят с курса.");
                        load();
                      }
                    }}
                  >
                    Снять
                  </button>
                </div>
              ))
            ) : (
              <em>Пока никто не записан</em>
            )}
          </div>
        </article>
      ))}
    </section>
  );
}
