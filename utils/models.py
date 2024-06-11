import pymongo

from utils.exts import mongo


class Base:
    collection = None  # 基类中定义的默认集合名称

    @classmethod
    def save(cls, data):
        # 保存数据到数据库
        mongo.db[cls.collection].insert_one(data)

    @classmethod
    def find_by_id(cls, _id):
        # 根据文ID查找数据
        return mongo.db[cls.collection].find_one({"_id": _id})

    @classmethod
    def find_by_condition(cls, condition):
        # 根据条件查找数据
        return mongo.db[cls.collection].find_one(condition)


# 创建用户类
class User(Base):
    """
    user_data = {
        "name": "name",
        "password": "password",
        "email": "admin@example.com"
        "token": "<PASSWORD>"
        "role": "admin/common"
    }
    """
    collection = "user"

    def __init__(self, user_data):
        self._id = user_data.get("_id")
        self.name = user_data.get("name")
        self.password = user_data.get("password")
        self.email = user_data.get("email")
        self.user_data = user_data

    @staticmethod
    def getUser(condition):
        # 查询用户
        user_data = mongo.db.user.find_one(condition)
        user = User(user_data) if user_data else None
        return user

    def update(self, new_data):
        # 更新用户数据
        mongo.db.user.update_one({"_id": self.user_data["_id"]}, {"$set": new_data})

    def delete(self):
        # 删除用户数据
        mongo.db.user.delete_one({"_id": self.user_data["_id"]})


# 创建文章类
class Article(Base):
    """
        article_data = {
        "title": "Sample Article",
        "content": "This is a sample article content.",
        "create_time": datetime.now(),
        author: user,
        "author_id": user._id
    }
    """
    collection = "article"

    def __init__(self, article_data):
        self._id = article_data.get("_id")
        self.title = article_data.get("title")
        self.content = article_data.get("content")
        self.create_time = article_data.get("create_time")

        self.author = article_data.get("author")
        self.author_id = article_data.get("author_id")

    @property
    def comments(self):
        # 获取当前文章的所有评论
        return Comment.getCommentsForArticle({"article_id": self._id})

    @staticmethod
    def getArticleById(_id):
        # 查询文章
        article_data = mongo.db.article.find_one({"_id": _id})
        article = Article(article_data) if article_data else None
        return article

    @staticmethod
    def getArticles(condition=None):
        # 查询文章
        articles_data = mongo.db.article.find(condition).sort("create_time", pymongo.DESCENDING)
        articles_list = [Article(article) for article in articles_data]
        return articles_list

    def update(self, new_data):
        # 更新文章数据
        mongo.db.article.update_one({"_id": self._id}, {"$set": new_data})

    def delete(self):
        # 删除文章数据
        mongo.db.article.delete_one({"_id": self._id})


# 创建评论类
class Comment(Base):
    """
        comment_data = {
        "content": " comment content",
        "create_time": datetime.now(),

        "author_id": user._id,
        "article_id": article._id
    }
    """
    collection = "comment"

    def __init__(self, comment_data):
        self._id = comment_data.get("_id")
        self.content = comment_data.get("content")
        self.create_time = comment_data.get("create_time")

        self.author_id = comment_data.get("author_id")
        self.article_id = comment_data.get("article_id")

    @property
    def user(self):
        # 获取评论的作者
        return User.getUser({"_id": self.author_id})

    @staticmethod
    def getCommentsForArticle(condition):
        # 查询特定文章的评论
        comments_data = mongo.db.comment.find(condition).sort("create_time", pymongo.DESCENDING)
        comments_list = [Comment(comment) for comment in comments_data]
        return comments_list

    @staticmethod
    def getCommentById(_id):
        # 查询评论
        comment = Comment(mongo.db.comment.find_one({"_id": _id}))
        return comment

    def update(self, new_data):
        # 更新评论数据
        mongo.db.comment.update_one({"_id": self._id}, {"$set": new_data})

    def delete(self):
        # 删除评论数据
        mongo.db.comment.delete_one({"_id": self._id})


class Message(Base):
    """
        message_data = {
            "session_id": session_id
            "from_user": "customer/agent"
            "content": "message content",
            "create_time": datetime.now(),
        }
    """
    collection = "message"

    def __init__(self, message_data):
        self._id = message_data.get("_id")
        self.session_id = message_data.get("session_id")
        self.from_user = message_data.get("from_user")
        self.content = message_data.get("content")
        self.create_time = message_data.get("create_time")

    @staticmethod
    def getMessages(condition=None):
        # 查询消息
        messages_data = mongo.db.message.find(condition)
        messages_list = [Message(message) for message in messages_data]
        return messages_list

    @staticmethod
    def getAllSessionId():
        # 获取所有session_id
        session_id_list = mongo.db.message.distinct("session_id")
        return session_id_list

    @staticmethod
    def getCurrentMessage(condition):
        # 构建聚合管道
        pipeline = [
            {"$match": condition},  # 匹配条件
            {"$sort": {"create_time": pymongo.DESCENDING}},  # 按创建时间排序
            {"$limit": 1}  # 限制结果集只返回第一个文档
        ]
        # 执行聚合查询
        message = list(mongo.db.message.aggregate(pipeline))[0]
        return message  # 返回结果或者None（如果没有匹配的文档）


class Contact(Base):
    """
        email_data = {
        name = 姓名
        email = 邮箱
        subject = 主题
        message = 内容
        create_time = 发送时间
    }
    """
    collection = "contact"

    def __init__(self, email_data):
        self._id = email_data.get("_id")
        self.name = email_data.get("name")
        self.email = email_data.get("email")
        self.subject = email_data.get("subject")
        self.message = email_data.get("message")
        self.create_time = email_data.get("create_time")


